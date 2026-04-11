import { isYesterday, isSameDay } from './storage.js'

// Calcula XP ganado al actualizar una meta numérica
export function calcXPForUpdate(goal, newValue) {
  const oldPct = goal.current / goal.target
  const newPct = Math.min(1, newValue / goal.target)
  const delta   = newPct - oldPct
  if (delta <= 0) return 0

  let xp = Math.round(goal.xpBase * delta * 2)

  // Bonus por completar
  if (newPct >= 1 && oldPct < 1) xp += Math.round(goal.xpBase * 0.5)

  // Bonus de racha
  const streak = goal.streak || 0
  if (streak >= 7)   xp = Math.round(xp * 1.25)
  if (streak >= 14)  xp = Math.round(xp * 1.5)
  if (streak >= 30)  xp = Math.round(xp * 2)

  return xp
}

// Actualiza la racha de una meta según la fecha de última actualización
export function updateStreak(goal) {
  const now        = new Date()
  const lastUpdate = goal.lastUpdated ? new Date(goal.lastUpdated) : null

  if (!lastUpdate) {
    // Primera actualización
    return { streak: 1, lastUpdated: now.toISOString() }
  }

  if (isSameDay(lastUpdate, now)) {
    // Ya actualizó hoy — mantener racha pero no sumar
    return { streak: goal.streak || 1, lastUpdated: lastUpdate.toISOString() }
  }

  if (isYesterday(lastUpdate)) {
    // Actualizó ayer — sumar a la racha
    const newStreak = (goal.streak || 0) + 1
    return { streak: newStreak, lastUpdated: now.toISOString() }
  }

  // Rompió la racha — resetear
  return { streak: 1, lastUpdated: now.toISOString() }
}

// Verifica rachas rotas al abrir la app
export function checkBrokenStreaks(goals) {
  const now = new Date()
  return goals.map(goal => {
    if (!goal.lastUpdated) return goal
    const last = new Date(goal.lastUpdated)
    const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24))

    if (diffDays >= 2 && (goal.type === 'streak' || goal.type === 'habit')) {
      // Racha rota
      return { ...goal, streak: 0, streakBroken: true }
    }
    return { ...goal, streakBroken: false }
  })
}
