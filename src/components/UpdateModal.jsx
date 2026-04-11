import React, { useState, useEffect } from 'react'

export default function UpdateModal({ goal, onConfirm, onClose }) {
  const [value, setValue] = useState(goal?.current || 0)

  useEffect(() => {
    if (goal) setValue(goal.current)
  }, [goal])

  if (!goal) return null

  const pct = Math.min(100, Math.round((value / goal.target) * 100))

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.7)',
        zIndex: 200,
        display: 'flex', alignItems: 'flex-end',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg2)',
          borderTop: '0.5px solid var(--border2)',
          borderRadius: '16px 16px 0 0',
          padding: '28px 20px 48px',
          width: '100%',
          maxWidth: 480,
          margin: '0 auto',
          animation: 'slideUp 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div style={{
          width: 36, height: 4, background: 'var(--border2)',
          borderRadius: 2, margin: '-12px auto 20px',
        }} />

        <div style={{ fontSize: 11, color: 'var(--text3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6, fontFamily: "'DM Mono', monospace" }}>
          Actualizar progreso
        </div>
        <div style={{ fontSize: 16, color: 'var(--text)', marginBottom: 24, fontFamily: "'DM Sans', sans-serif" }}>
          {goal.name}
        </div>

        {/* Big value display */}
        <div style={{ textAlign: 'center', margin: '0 0 8px' }}>
          <span style={{ fontSize: 40, color: 'var(--accent)', fontFamily: "'Playfair Display', serif" }}>
            {Number.isInteger(value) ? value : value.toFixed(1)}
          </span>
          <span style={{ fontSize: 16, color: 'var(--text2)', marginLeft: 6 }}>{goal.unit}</span>
        </div>

        {/* Progress preview */}
        <div style={{ fontSize: 12, color: 'var(--text3)', textAlign: 'center', marginBottom: 20, fontFamily: "'DM Mono', monospace" }}>
          {pct}% de {goal.target} {goal.unit}
        </div>

        {/* Slider */}
        <input
          type="range"
          min={0}
          max={goal.target}
          step={goal.target > 100 ? Math.ceil(goal.target / 100) : 0.5}
          value={value}
          onChange={e => setValue(parseFloat(e.target.value))}
          style={{
            width: '100%',
            accentColor: 'var(--accent)',
            marginBottom: 28,
            height: 4,
          }}
        />

        {/* Buttons */}
        <button
          onClick={() => { onConfirm(goal.id, value); onClose() }}
          style={{
            width: '100%',
            background: 'var(--accent)',
            color: '#000',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '14px',
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 10,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Guardar progreso
        </button>
        <button
          onClick={onClose}
          style={{
            width: '100%',
            background: 'transparent',
            color: 'var(--text3)',
            border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '11px',
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
