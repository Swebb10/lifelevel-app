// IDs remain stable so themes survive app updates and existing stored data.
export const THEMES = [
  { id: 'dark', name: 'Oscuro', description: 'Carbón y salvia', mode: 'dark', background: '#101211' },
  { id: 'light', name: 'Claro', description: 'Marfil y bosque', mode: 'light', background: '#f6f7f2' },
  { id: 'cyberpunk', name: 'Cyberpunk', description: 'Neón sobre medianoche', mode: 'dark', background: '#0c0914' },
  { id: 'ocean', name: 'Océano', description: 'Azul profundo y turquesa', mode: 'dark', background: '#09151e' },
  { id: 'graphite', name: 'Gris', description: 'Negro, grafito y plata', mode: 'dark', background: '#090a0c' },
  { id: 'crimson', name: 'Rojo', description: 'Negro y rojo profundo', mode: 'dark', background: '#050505' },
  { id: 'ps2', name: 'PS2', description: 'Negro, azul noche y violeta', mode: 'dark', background: '#080a13' },
]
const LEGACY_THEMES = { sunset: 'crimson', lavender: 'ps2' }
export const getTheme = id => THEMES.find(theme => theme.id === (LEGACY_THEMES[id] || id)) || THEMES[0]

export function applyTheme(id, doc = document) {
  const theme = getTheme(id)
  doc.documentElement.dataset.theme = theme.id
  doc.documentElement.style.colorScheme = theme.mode
  doc.documentElement.classList.remove('light')
  doc.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.background)
}
