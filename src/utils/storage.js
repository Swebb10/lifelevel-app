import { createFinance, normalizeFinance } from './finance.js'
import { getTheme } from '../data/themes.js'
import { normalizeGoalDayRecords } from './goalStreak.js'

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
  finance: createFinance(),
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...DEFAULT_STATE }
    const saved = JSON.parse(raw)
    return { ...DEFAULT_STATE, ...saved, theme: getTheme(saved?.theme).id, goals: normalizeGoalDayRecords(saved?.goals), finance: normalizeFinance(saved?.finance) }
  } catch {
    return { ...DEFAULT_STATE }
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
    return true
  } catch (e) {
    console.warn('No se pudo guardar en localStorage', e)
    return false
  }
}

// Convierte una fecha a string YYYY-MM-DD en local timezone
export function toDateStr(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
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
