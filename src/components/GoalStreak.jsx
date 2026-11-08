import React, { useState } from 'react'
import { getGoalStreakSummary } from '../utils/goalStreak.js'
import { toDateStr } from '../utils/storage.js'
import './GoalStreak.css'

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const weekdayNames = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']
const monthName = date => date.toLocaleDateString('es-CR', { month: 'long', year: 'numeric' })
const longDate = date => new Date(`${date}T12:00:00`).toLocaleDateString('es-CR', { weekday: 'long', day: 'numeric', month: 'long' })

function monthCells(month) {
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const first = new Date(year, monthIndex, 1, 12)
  const startOffset = (first.getDay() + 6) % 7
  const days = new Date(year, monthIndex + 1, 0, 12).getDate()
  return [...Array(startOffset).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
}

export default function GoalStreak({ goalName, records = {}, onMark }) {
  const today = toDateStr()
  const now = new Date()
  const [month, setMonth] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1, 12))
  const [selectedDate, setSelectedDate] = useState(today)
  const { current, best } = getGoalStreakSummary(records, today)
  const cells = monthCells(month)
  const selectedStatus = records[selectedDate]
  const selectedLabel = selectedDate === today ? 'Hoy' : longDate(selectedDate)
  const monthTitle = monthName(month)

  const changeMonth = amount => {
    const next = new Date(month.getFullYear(), month.getMonth() + amount, 1, 12)
    setMonth(next)
    setSelectedDate(toDateStr(next))
  }
  const canGoNext = month.getFullYear() < now.getFullYear() || (month.getFullYear() === now.getFullYear() && month.getMonth() < now.getMonth())

  return <section className="personal-streak" aria-labelledby="personal-streak-title">
    <div className="personal-streak-intro">
      <div className="personal-streak-copy">
        <span className="eyebrow">UN DÍA A LA VEZ</span>
        <h2 id="personal-streak-title">Constancia de {goalName}</h2>
        <p>Registra los días que cumpliste esta meta y aquellos en que no. Puedes elegir cualquier fecha pasada para completar o corregir su calendario.</p>
      </div>
      <div className="personal-streak-stats" aria-label="Resumen de racha">
        <div className="personal-streak-stat"><strong>{current}</strong><span>Racha actual</span><small>días seguidos</small></div>
        <div className="personal-streak-stat"><strong>{best}</strong><span>Mejor racha</span><small>días seguidos</small></div>
      </div>
    </div>

    <div className="personal-streak-calendar">
      <div className="streak-calendar-heading">
        <div><span className="eyebrow">TU HISTORIAL</span><h3>{monthTitle}</h3></div>
        <div className="streak-month-controls">
          <button type="button" aria-label="Mes anterior" onClick={() => changeMonth(-1)}>‹</button>
          <button type="button" aria-label="Mes siguiente" onClick={() => changeMonth(1)} disabled={!canGoNext}>›</button>
        </div>
      </div>
      <div className="streak-calendar-grid" role="group" aria-label={`Calendario de ${monthTitle}`}>
        {WEEKDAYS.map((day, index) => <span className="streak-weekday" key={weekdayNames[index]} aria-label={weekdayNames[index]}>{day}</span>)}
        {cells.map((day, index) => {
          if (!day) return <span className="streak-day-empty" key={`empty-${index}`} aria-hidden="true" />
          const date = toDateStr(new Date(month.getFullYear(), month.getMonth(), day, 12))
          const status = records[date]
          const future = date > today
          return <button type="button" key={date} className={`streak-day ${status ? `is-${status}` : ''} ${selectedDate === date ? 'is-selected' : ''} ${date === today ? 'is-today' : ''}`} aria-label={`${longDate(date)}${status === 'kept' ? ', cumplido' : status === 'missed' ? ', no cumplido' : ''}${date === today ? ', hoy' : ''}`} aria-pressed={selectedDate === date} disabled={future} onClick={() => setSelectedDate(date)}>{day}</button>
        })}
      </div>
      <div className="streak-legend" aria-label="Estados del calendario"><span><i className="is-kept"/>Cumplido</span><span><i className="is-missed"/>No cumplido</span><span><i className="is-empty"/>Sin registro</span></div>
    </div>

    <div className="personal-streak-actions">
      <div className="streak-selected-date"><span className="eyebrow">DÍA SELECCIONADO</span><strong>{selectedLabel}</strong>{selectedStatus && <span className={`streak-status-text ${selectedStatus}`}>{selectedStatus === 'kept' ? 'Cumplido' : 'No cumplido'}</span>}</div>
      <div className="streak-mark-buttons">
        <button type="button" className={`streak-mark-button kept ${selectedStatus === 'kept' ? 'active' : ''}`} aria-pressed={selectedStatus === 'kept'} onClick={() => onMark(selectedDate, 'kept')}><b aria-hidden="true">✓</b><span>Lo cumplí</span></button>
        <button type="button" className={`streak-mark-button missed ${selectedStatus === 'missed' ? 'active' : ''}`} aria-pressed={selectedStatus === 'missed'} onClick={() => onMark(selectedDate, 'missed')}><b aria-hidden="true">×</b><span>No lo cumplí</span></button>
        {selectedStatus && <button type="button" className="streak-clear-button" onClick={() => onMark(selectedDate, null)}>Quitar registro</button>}
      </div>
    </div>
  </section>
}
