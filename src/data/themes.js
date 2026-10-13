// IDs remain stable so themes survive app updates and existing stored data.
export const THEMES = [
  { id: 'dark', name: 'Oscuro', description: 'Carbón y salvia', mode: 'dark', background: '#101211' },
  { id: 'light', name: 'Claro', description: 'Marfil y bosque', mode: 'light', background: '#f6f7f2' },
  { id: 'cyberpunk', name: 'Cyberpunk', description: 'Neón sobre medianoche', mode: 'dark', background: '#0c0914' },
  { id: 'ocean', name: 'Océano', description: 'Azul profundo y turquesa', mode: 'dark', background: '#09151e' },
  { id: 'sunset', name: 'Atardecer', description: 'Ciruela y ámbar', mode: 'dark', background: '#1c1119' },
  { id: 'lavender', name: 'Lavanda', description: 'Lila suave y tinta violeta', mode: 'light', background: '#f5f2fb' },
]
export const getTheme = id => THEMES.find(theme => theme.id === id) || THEMES[0]

export function applyTheme(id, doc = document) {
  const theme = getTheme(id)
  doc.documentElement.dataset.theme = theme.id
  doc.documentElement.style.colorScheme = theme.mode
  doc.documentElement.classList.remove('light')
  doc.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.background)
}
