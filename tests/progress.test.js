import test from 'node:test'
import assert from 'node:assert/strict'
import { applyProgress } from '../src/utils/progress.js'
import { checkBrokenStreaks } from '../src/utils/xp.js'
const base = (changes = {}) => ({ xp: 0, totalXP: 0, currentLevel: 1, goals: [{ id: 1, type: 'num', target: 10, current: 0, xpBase: 100, streak: 0, ...changes }] })
test('habit can only award XP once per local day', () => {
  const first = applyProgress(base({ type: 'habit' }), 1, null, true)
  assert.equal(first.goals[0].current, 1)
  assert.ok(first.xp > 0)
  assert.equal(applyProgress(first, 1, null, true), first)
})
test('repeating or lowering progress does not farm XP or streaks', () => {
  const first = applyProgress(base(), 1, 5)
  assert.equal(applyProgress(first, 1, 5), first)
  const lower = applyProgress(first, 1, 2)
  assert.equal(lower.xp, first.xp)
  assert.equal(applyProgress(lower, 1, 5).xp, first.xp)
  assert.equal(applyProgress(lower, 1, 10).xp, 250)
})
test('invalid progress and missing IDs leave state intact; negatives clamp to zero', () => {
  const state = base()
  assert.equal(applyProgress(state, 1, NaN), state)
  assert.equal(applyProgress(state, 1, Infinity), state)
  assert.equal(applyProgress(state, 99, 4), state)
  assert.equal(applyProgress(state, 1, -4), state)
})
test('completion bonus is paid once and completion status follows actual progress', () => {
  const done = applyProgress(base(), 1, 10)
  const lowered = applyProgress(done, 1, 4)
  assert.equal(lowered.goals[0].completedAt, null)
  assert.equal(applyProgress(lowered, 1, 10).xp, done.xp)
})
test('daily goals cannot use numeric updates or exceed their target', () => {
  const state = base({ type: 'habit', current: 10 })
  assert.equal(applyProgress(state, 1, null, true), state)
  assert.equal(applyProgress(state, 1, 5), state)
})
test('streak goals reset across missed calendar days', () => {
  const last = new Date(); last.setDate(last.getDate() - 2); last.setHours(23, 59)
  const state = base({ type: 'streak', current: 4, streak: 4, lastUpdated: last.toISOString() })
  const checked = checkBrokenStreaks(state.goals)
  assert.equal(checked[0].streak, 0)
  assert.equal(checked[0].current, 0)
  const resumed = applyProgress({ ...state, goals: checked }, 1, null, true)
  assert.equal(resumed.goals[0].current, 1)
  assert.equal(resumed.goals[0].streakBroken, false)
})
test('reaching a threshold triggers the reward level', () => {
  const state = base({ xpBase: 300 })
  const done = applyProgress(state, 1, 10)
  assert.equal(done.currentLevel, 2)
  assert.equal(done.pendingLevelUp, 2)
})
