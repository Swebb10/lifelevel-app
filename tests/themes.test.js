import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { THEMES, getTheme, applyTheme } from '../src/data/themes.js'
import { loadState, saveState } from '../src/utils/storage.js'

const css = readFileSync(new URL('../src/themes.css', import.meta.url), 'utf8')
const blocks = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
function tokens(id) {
  const block = blocks.find(([, selector]) => selector.includes(`.theme-preview[data-theme="${id}"]`))
  assert.ok(block, `Missing palette: ${id}`)
  return Object.fromEntries([...block[2].matchAll(/--([a-z0-9-]+):\s*(#[a-f0-9]{6}(?:[a-f0-9]{2})?)\s*;/gi)].map(([, key, value]) => [key, value]))
}
function rgb(hex) { return [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)) }
function composite(foreground, background) {
  const alpha = foreground.length === 9 ? parseInt(foreground.slice(7), 16) / 255 : 1
  return rgb(foreground).map((value, i) => alpha * value + (1 - alpha) * rgb(background)[i])
}
function luminance(channels) {
  const [r, g, b] = channels.map(v => { const c = v / 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4 })
  return .2126 * r + .7152 * g + .0722 * b
}
function contrast(a, b) {
  const x = luminance(typeof a === 'string' ? rgb(a) : a)
  const y = luminance(typeof b === 'string' ? rgb(b) : b)
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05)
}
function expectContrast(fg, bg, minimum, name) {
  const ratio = contrast(fg, bg)
  assert.ok(ratio >= minimum, `${name}: ${ratio.toFixed(2)}:1 is below ${minimum}:1`)
}

for (const theme of THEMES) {
  test(`${theme.name}: readable text, semantic badges, primary buttons and control outlines`, () => {
    const t = tokens(theme.id)
    assert.equal(t.bg, theme.background)
    for (const surface of ['bg', 'bg2', 'bg3', 'surface', 'hero']) {
      for (const ink of ['text', 'text2', 'text3', 'accent', 'green', 'blue', 'red', 'purple']) {
        expectContrast(t[ink], t[surface], 4.5, `${theme.id} ${ink} on ${surface}`)
      }
      for (const color of ['accent', 'green', 'blue', 'red', 'purple']) {
        const bg = composite(t[`${color}-bg`], t[surface])
        expectContrast(t[color], bg, 4.5, `${theme.id} ${color} badge on ${surface}`)
        expectContrast(t.text3, bg, 4.5, `${theme.id} secondary text on ${color} tint / ${surface}`)
      }
      expectContrast(t.border2, t[surface], 3, `${theme.id} control border on ${surface}`)
    }
    expectContrast(t.bg, t.accent, 4.5, `${theme.id} primary button label`)
    expectContrast(t.accent, t.surface, 3, `${theme.id} focus ring`)
  })
}

test('six unique themes include existing preferences and Cyberpunk', () => {
  assert.equal(new Set(THEMES.map(t => t.id)).size, 6)
  for (const id of ['dark', 'light', 'cyberpunk']) assert.equal(getTheme(id).id, id)
  assert.equal(getTheme('unknown').id, 'dark')
})

test('every theme survives persistence while finance data stays intact', () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  const records = new Map()
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: key => records.get(key), setItem: (key, value) => records.set(key, value) } })
  try {
    for (const theme of THEMES) {
      const loaded = loadState()
      const state = { ...loaded, theme: theme.id, finance: { ...loaded.finance, accounts: [{ id: 'cash', name: 'Efectivo', currency: 'CRC', opening: 12000 }] } }
      assert.equal(saveState(state), true)
      const restored = loadState()
      assert.equal(restored.theme, theme.id)
      assert.deepEqual(restored.finance, state.finance)
    }
    records.set('lifelevel_v1', JSON.stringify({ theme: 'obsolete', xp: 100 }))
    assert.equal(loadState().theme, 'dark')
    assert.equal(loadState().xp, 100)
  } finally { if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor); else delete globalThis.localStorage }
})

test('switching themes updates the root, native controls and installed-app toolbar', () => {
  const attributes = {}
  const doc = { documentElement: { dataset: {}, style: {}, classList: { remove: () => {} } }, querySelector: () => ({ setAttribute: (key, value) => { attributes[key] = value } }) }
  for (const theme of THEMES) {
    applyTheme(theme.id, doc)
    assert.equal(doc.documentElement.dataset.theme, theme.id)
    assert.equal(doc.documentElement.style.colorScheme, theme.mode)
    assert.equal(attributes.content, theme.background)
  }
})
