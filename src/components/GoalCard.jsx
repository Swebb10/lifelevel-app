import React from 'react'
import { CATEGORIES } from '../data/goalTypes.js'
import { toDateStr } from '../utils/storage.js'
export default function GoalCard({ goal, onHabit, onDelete, onDetail }) {
  const cat = CATEGORIES[goal.cat] || CATEGORIES.fin
  const pct = Math.min(100, Math.round(goal.current / goal.target * 100))
  const done = goal.current >= goal.target
  const daily = ['habit', 'streak'].includes(goal.type)
  const doneToday = goal.lastUpdated && toDateStr(new Date(goal.lastUpdated)) === toDateStr()
  const color = { teal: 'green', pink: 'purple' }[cat.color] || cat.color
  return <article className="goal-card fade-in">
    <div className="goal-card-header"><span className="category-icon" style={{ color: `var(--${color})`, background: `var(--${color}-bg)` }}>{cat.icon}</span><div><small>{cat.label}</small></div><button className="icon-button" aria-label={`Eliminar ${goal.name}`} onClick={() => onDelete(goal.id)}>×</button></div>
    <h3><button style={{ background: 'transparent', color: 'inherit', textAlign: 'left' }} onClick={() => onDetail(goal)}>{goal.name}</button></h3>
    <div className="goal-progress-label"><span><strong>{goal.current}</strong> / {goal.target} {goal.unit}</span><strong>{pct}%</strong></div>
    <div className="progress-track" role="progressbar" aria-label={`Progreso de ${goal.name}`} aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}><div style={{ width: `${pct}%`, background: `var(--${color})` }}/></div>
    <div className="goal-card-footer"><span>{done ? '✓ Meta cumplida' : goal.streak > 0 ? `${goal.streak} días de constancia` : `${goal.xpBase} XP base`}</span>{daily && !done ? <button className="goal-action" disabled={doneToday} onClick={() => onHabit(goal.id)}>{doneToday ? '✓ Hecho hoy' : 'Marcar hoy +'} </button> : <button className="goal-action" onClick={() => onDetail(goal)}>{done ? 'Ver detalle' : 'Actualizar'} ↗</button>}</div>
  </article>
}
