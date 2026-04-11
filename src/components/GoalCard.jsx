import React from 'react'
import { CATEGORIES } from '../data/goalTypes.js'
import { toDateStr } from '../utils/storage.js'

const COLOR_MAP = {
  blue:   { text: 'var(--blue)',   bg: 'var(--blue-bg)'   },
  green:  { text: 'var(--green)',  bg: 'var(--green-bg)'  },
  red:    { text: 'var(--red)',    bg: 'var(--red-bg)'    },
  purple: { text: 'var(--purple)', bg: 'var(--purple-bg)' },
  teal:   { text: 'var(--green)',  bg: 'var(--green-bg)'  },
  pink:   { text: 'var(--purple)', bg: 'var(--purple-bg)' },
}

export default function GoalCard({ goal, onUpdate, onHabit, onDelete, onDetail }) {
  const cat    = CATEGORIES[goal.cat] || CATEGORIES.fin
  const colors = COLOR_MAP[cat.color] || COLOR_MAP.blue
  const pct    = Math.min(100, Math.round((goal.current / goal.target) * 100))
  const isDone = goal.current >= goal.target

  const today            = toDateStr()
  const doneToday        = goal.lastUpdated && toDateStr(new Date(goal.lastUpdated)) === today
  const remaining        = +(goal.target - goal.current).toFixed(2)
  const isStreakOrHabit  = goal.type === 'streak' || goal.type === 'habit'

  return (
    <div
      className="fade-in"
      style={{
        background:    'var(--surface)',
        border:        `0.5px solid ${isDone ? 'var(--accent-border)' : 'var(--border)'}`,
        borderRadius:  'var(--radius)',
        padding:       '16px',
        cursor:        'pointer',
        transition:    'border-color 0.2s, transform 0.15s',
        boxShadow:     'var(--shadow)',
      }}
      onClick={() => onDetail ? onDetail(goal) : (isStreakOrHabit ? onHabit(goal.id) : onUpdate(goal))}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 8, flexShrink: 0,
          background: colors.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, color: colors.text,
          fontFamily: "'DM Mono', monospace",
        }}>
          {cat.icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 14, color: 'var(--text)', lineHeight: 1.3,
            fontFamily: "'DM Sans', sans-serif",
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {isDone && <span style={{ color: 'var(--accent)', marginRight: 5 }}>✓</span>}
            {goal.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2, fontFamily: "'DM Mono', monospace" }}>
            {goal.current} / {goal.target} {goal.unit}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <span style={{
            fontSize: 10, color: 'var(--accent)', background: 'var(--accent-bg)',
            padding: '2px 8px', borderRadius: 10,
            fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap',
          }}>
            +{goal.xpBase} XP
          </span>
          <button
            onClick={e => { e.stopPropagation(); onDelete(goal.id) }}
            style={{
              background: 'transparent', border: 'none', color: 'var(--text3)',
              fontSize: 14, padding: '0 2px', lineHeight: 1,
              cursor: 'pointer', transition: 'color 0.2s',
            }}
            title="Eliminar meta"
            onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}
          >
            ×
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            background: isDone
              ? 'linear-gradient(90deg, var(--accent), var(--accent2))'
              : colors.text,
            borderRadius: 2,
            transition: 'width 0.7s cubic-bezier(0.4,0,0.2,1)',
          }} />
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: 10, color: 'var(--text3)', marginTop: 5,
          fontFamily: "'DM Mono', monospace",
        }}>
          <span>{pct}% completado</span>
          {!isDone && <span>{remaining} {goal.unit} restante</span>}
          {isDone  && <span style={{ color: 'var(--accent)' }}>¡Meta cumplida!</span>}
        </div>
      </div>

      {/* Racha + estado de hoy */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {(goal.streak > 0) && (
          <span style={{
            fontSize: 10, color: 'var(--accent)', background: 'var(--accent-bg)',
            padding: '2px 8px', borderRadius: 10, fontFamily: "'DM Mono', monospace",
          }}>
            🔥 {goal.streak} {goal.streak === 1 ? 'día' : 'días'} de racha
          </span>
        )}
        {goal.streakBroken && (
          <span style={{
            fontSize: 10, color: 'var(--red)', background: 'var(--red-bg)',
            padding: '2px 8px', borderRadius: 10, fontFamily: "'DM Mono', monospace",
          }}>
            ⚡ Racha rota — empieza de nuevo
          </span>
        )}
        {isStreakOrHabit && doneToday && (
          <span style={{
            fontSize: 10, color: 'var(--green)', background: 'var(--green-bg)',
            padding: '2px 8px', borderRadius: 10, fontFamily: "'DM Mono', monospace",
          }}>
            ✓ Hecho hoy
          </span>
        )}
        {isStreakOrHabit && !doneToday && (
          <span style={{
            fontSize: 10, color: 'var(--text3)',
            fontFamily: "'DM Mono', monospace",
          }}>
            Toca para marcar hoy →
          </span>
        )}
      </div>
    </div>
  )
}
