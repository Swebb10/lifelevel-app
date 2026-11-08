const VALID_STATUS = new Set(['kept', 'missed'])
const localDate = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export function normalizePersonalStreak(value) {
  const records = {}
  const entries = value?.records && typeof value.records === 'object' ? Object.entries(value.records) : []
  for (const [date, status] of entries) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date) && localDate(new Date(`${date}T12:00:00`)) === date && VALID_STATUS.has(status)) records[date] = status
  }
  return { records }
}

export function shiftDay(date, amount) {
  const [year, month, day] = date.split('-').map(Number)
  const shifted = new Date(year, month - 1, day, 12)
  shifted.setDate(shifted.getDate() + amount)
  return localDate(shifted)
}

export function getPersonalStreakSummary(records = {}, today = localDate(new Date())) {
  const datedEntries = Object.entries(records)
    .filter(([date, status]) => date <= today && VALID_STATUS.has(status))
    .sort(([a], [b]) => a.localeCompare(b))

  let best = 0
  let run = 0
  let previous = null
  for (const [date, status] of datedEntries) {
    if (status === 'kept') {
      run = previous && shiftDay(previous, 1) === date ? run + 1 : 1
      best = Math.max(best, run)
    } else {
      run = 0
    }
    previous = date
  }

  if (records[today] === 'missed') return { current: 0, best }
  let cursor = records[today] === 'kept' ? today : shiftDay(today, -1)
  let current = 0
  while (records[cursor] === 'kept') {
    current += 1
    cursor = shiftDay(cursor, -1)
  }
  return { current, best }
}
