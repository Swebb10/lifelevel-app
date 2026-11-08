const VALID_STATUS = new Set(['kept', 'missed'])
const localDate = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export function normalizeGoalDayRecords(goals) {
  const today = localDate(new Date())
  if (!Array.isArray(goals)) return []
  return goals.map(goal => {
    const records = {}
    const hasDayHistory = !!goal && Object.prototype.hasOwnProperty.call(goal, 'dailyRecords')
    const savedRecords = goal?.dailyRecords && typeof goal.dailyRecords === 'object' ? Object.entries(goal.dailyRecords) : []
    for (const [date, status] of savedRecords) {
      if (date <= today && /^\d{4}-\d{2}-\d{2}$/.test(date) && localDate(new Date(`${date}T12:00:00`)) === date && VALID_STATUS.has(status)) records[date] = status
    }
    const hadSavedRecords = Object.keys(records).length > 0

    const latest = goal?.lastUpdated ? localDate(new Date(goal.lastUpdated)) : null
    if (!hasDayHistory && latest && latest <= today && /^\d{4}-\d{2}-\d{2}$/.test(latest) && !records[latest]) records[latest] = 'kept'

    if (!hasDayHistory && !hadSavedRecords && latest && records[latest] === 'kept') {
      const legacyRun = Math.max(1, Math.min(3650, Number(goal.streak) || 1))
      for (let offset = 1; offset < legacyRun; offset += 1) {
        const day = shiftDay(latest, -offset)
        if (records[day] === 'missed') break
        records[day] = 'kept'
      }
    }
    return { ...goal, dailyRecords: records }
  })
}

export function shiftDay(date, amount) {
  const [year, month, day] = date.split('-').map(Number)
  const shifted = new Date(year, month - 1, day, 12)
  shifted.setDate(shifted.getDate() + amount)
  return localDate(shifted)
}

export function getGoalStreakSummary(records = {}, today = localDate(new Date())) {
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
