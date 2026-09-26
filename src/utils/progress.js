import { calcXPForUpdate, updateStreak } from './xp.js'
import { getLevel } from '../data/levels.js'
import { isSameDay } from './storage.js'

export function applyProgress(state, id, value, daily = false) {
  const goal = state.goals.find(g => g.id === id)
  if (!goal || !Number.isFinite(goal.target) || goal.target <= 0) return state
  const isDaily = ['habit', 'streak'].includes(goal.type)
  if (daily !== isDaily) return state
  if (daily && (goal.current >= goal.target || (goal.lastUpdated && isSameDay(goal.lastUpdated, new Date())))) return state
  if (!daily && !Number.isFinite(value)) return state
  const streakData = updateStreak(goal)
  const current = daily ? Math.min(goal.target, goal.type === 'streak' ? streakData.streak : goal.current + 1) : Math.max(0, Math.min(value, goal.target))
  if (!daily && current === goal.current) return state
  const increased = current > goal.current
  const xpGained = daily ? Math.round(goal.xpBase * .1 * (1 + streakData.streak / 10)) : calcXPForUpdate(goal, current)
  const updated = { ...goal, current, ...(daily || increased ? streakData : {}), streakBroken: daily || increased ? false : goal.streakBroken, xpLastGained: xpGained, xpHighWater: Math.max(goal.xpHighWater ?? goal.current, current), completionRewarded: goal.completionRewarded || !!goal.completedAt || current >= goal.target, completedAt: current >= goal.target ? goal.completedAt || new Date().toISOString() : null }
  const xp = state.xp + xpGained
  const level = getLevel(xp).n
  return { ...state, goals: state.goals.map(g => g.id === id ? updated : g), xp, totalXP: (state.totalXP || 0) + xpGained, currentLevel: level, pendingLevelUp: level > state.currentLevel ? level : state.pendingLevelUp }
}
