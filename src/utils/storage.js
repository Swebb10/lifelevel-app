const KEY = 'lifelevel_v1'

export const DEFAULT_STATE = {
  xp: 0,
  totalXP: 0,
  currentLevel: 1,
  goals: [],
  notes: [],
  theme: 'dark',
  createdAt: new Date().toISOString(),
  lastSeen: null,
  nextGoalId: 1,
  nextNoteId: 1,
  seenRewards: [],
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...DEFAULT_STATE }
    return { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_STATE }
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch (e) {
    console.warn('No se pudo guardar en localStorage', e)
  }
}

// Convierte una fecha a string YYYY-MM-DD en local timezone
export function toDateStr(date = new Date()) {
  return date.toLocaleDateString('en-CA') // => "2025-03-22"
}

// Verifica si dos fechas son el mismo día
export function isSameDay(a, b) {
  return toDateStr(new Date(a)) === toDateStr(new Date(b))
}

// Verifica si 'date' fue ayer
export function isYesterday(date) {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return isSameDay(date, yesterday)
}
