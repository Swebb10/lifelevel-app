import { calcXPForUpdate } from './xp.js'
import { getLevel } from '../data/levels.js'
import { isSameDay, toDateStr } from './storage.js'
import { getGoalStreakSummary } from './goalStreak.js'

export function applyProgress(state, id, value, daily = false) {
  const goal = state.goals.find(g => g.id === id)
  if (!goal || !Number.isFinite(goal.target) || goal.target <= 0) return state
  const isDaily = ['habit', 'streak'].includes(goal.type)
  if (daily !== isDaily) return state
  if (daily && (goal.current >= goal.target || (goal.lastUpdated && isSameDay(goal.lastUpdated, new Date())))) return state
  if (!daily && !Number.isFinite(value)) return state
  const today = toDateStr()
  const now = new Date()
  const dailyRecords = { ...(goal.dailyRecords || {}), ...(daily ? { [today]: 'kept' } : {}) }
  const dailyStreak = daily ? getGoalStreakSummary(dailyRecords, today).current : null
  const streakData = daily ? { streak: dailyStreak, lastUpdated: now.toISOString() } : null
  const current = daily ? Math.min(goal.target, goal.type === 'streak' ? streakData.streak : goal.current + 1) : Math.max(0, Math.min(value, goal.target))
  if (!daily && current === goal.current) return state
  const increased = current > goal.current
  const recordsAfterProgress = daily || increased ? { ...dailyRecords, [today]: 'kept' } : goal.dailyRecords
  const recordedStreak = daily || increased ? getGoalStreakSummary(recordsAfterProgress, today).current : goal.streak
  const xpGained = daily ? Math.round(goal.xpBase * .1 * (1 + streakData.streak / 10)) : calcXPForUpdate(goal, current)
  const activityData = daily || increased ? { streak: recordedStreak, lastUpdated: now.toISOString(), dailyRecords: recordsAfterProgress } : {}
  const updated = { ...goal, current, ...activityData, streakBroken: daily || increased ? false : goal.streakBroken, xpLastGained: xpGained, xpHighWater: Math.max(goal.xpHighWater ?? goal.current, current), completionRewarded: goal.completionRewarded || !!goal.completedAt || current >= goal.target, completedAt: current >= goal.target ? goal.completedAt || now.toISOString() : null }
  const xp = state.xp + xpGained
  const level = getLevel(xp).n
  return { ...state, goals: state.goals.map(g => g.id === id ? updated : g), xp, totalXP: (state.totalXP || 0) + xpGained, currentLevel: level, pendingLevelUp: level > state.currentLevel ? level : state.pendingLevelUp }
}
