import test from 'node:test'
import assert from 'node:assert/strict'
import { loadState, saveState } from '../src/utils/storage.js'

test('existing goals, notes, XP and theme survive finance migration', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  const legacy = { theme: 'light', goals: [{ id: 12, name: 'Meta existente' }], notes: [{ id: 4, title: 'Mi nota' }], xp: 1234 }
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: () => JSON.stringify(legacy) } })
  try {
    const loaded = loadState()
    assert.deepEqual(loaded.goals, legacy.goals)
    assert.deepEqual(loaded.notes, legacy.notes)
    assert.equal(loaded.theme, 'light')
    assert.equal(loaded.xp, 1234)
    assert.deepEqual(loaded.finance.accounts, [])
  } finally { if (original) Object.defineProperty(globalThis, 'localStorage', original); else delete globalThis.localStorage }
})

test('saveState reports a storage failure without throwing away state', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  const warn = console.warn
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { setItem() { throw new Error('Quota exceeded') } } })
  console.warn = () => {}
  try { assert.equal(saveState({ xp: 3 }), false) }
  finally { console.warn = warn; if (original) Object.defineProperty(globalThis, 'localStorage', original); else delete globalThis.localStorage }
})
