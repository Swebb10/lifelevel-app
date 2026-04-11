import React, { useState } from 'react'
import { CATEGORIES, GOAL_TYPES, XP_TIERS } from '../data/goalTypes.js'

const INITIAL = {
  name: '', cat: 'fin', type: 'num',
  target: '', unit: '', xpBase: 150,
}

const inputStyle = {
  width: '100%',
  background: 'var(--bg3)',
  border: '0.5px solid var(--border2)',
  borderRadius: 'var(--radius-sm)',
  padding: '11px 12px',
  fontSize: 14,
  color: 'var(--text)',
  fontFamily: "'DM Sans', sans-serif",
  transition: 'border-color 0.2s',
}
const labelStyle = {
  fontSize: 10, color: 'var(--text3)', letterSpacing: 2,
  textTransform: 'uppercase', display: 'block', marginBottom: 6,
  fontFamily: "'DM Mono', monospace",
}

export default function AddGoalSheet({ onAdd, onClose }) {
  const [form, setForm] = useState(INITIAL)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = () => {
    if (!form.name.trim())    return setError('Ponle un nombre a la meta.')
    if (!form.target || +form.target <= 0) return setError('Escribe un valor meta válido.')
    if (!form.unit.trim())    return setError('Define la unidad (ej: $, kg, libros).')

    onAdd({
      name:    form.name.trim(),
      cat:     form.cat,
      type:    form.type,
      target:  parseFloat(form.target),
      unit:    form.unit.trim(),
      xpBase:  parseInt(form.xpBase),
    })
    setForm(INITIAL)
    setError('')
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.75)',
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
          maxHeight: '90dvh',
          overflowY: 'auto',
          animation: 'slideUp 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, background: 'var(--border2)', borderRadius: 2, margin: '-12px auto 24px' }} />

        <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 20, fontFamily: "'DM Mono', monospace" }}>
          Nueva Meta
        </div>

        {/* Nombre */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Nombre de la meta</label>
          <input
            style={inputStyle}
            placeholder="ej: Ahorrar $10,000"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border2)'}
          />
        </div>

        {/* Categoría */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Categoría</label>
          <div style={{ display: 'grid', gridColumns: 'repeat(3, 1fr)', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => set('cat', key)}
                style={{
                  background: form.cat === key ? 'var(--accent-bg)' : 'var(--bg3)',
                  border: `0.5px solid ${form.cat === key ? 'var(--accent-border)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 6px',
                  color: form.cat === key ? 'var(--accent)' : 'var(--text2)',
                  fontSize: 11,
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'all 0.15s',
                }}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tipo */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Tipo de meta</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Object.entries(GOAL_TYPES).map(([key, t]) => (
              <button
                key={key}
                onClick={() => set('type', key)}
                style={{
                  background: form.type === key ? 'var(--accent-bg)' : 'var(--bg3)',
                  border: `0.5px solid ${form.type === key ? 'var(--accent-border)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  color: form.type === key ? 'var(--accent)' : 'var(--text2)',
                  fontSize: 13,
                  textAlign: 'left',
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontWeight: 500 }}>{t.label}</span>
                <span style={{ fontSize: 11, color: 'var(--text3)', marginLeft: 8 }}>{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Meta + Unidad */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>Valor meta</label>
            <input
              style={inputStyle} type="number" placeholder="5000"
              value={form.target}
              onChange={e => set('target', e.target.value)}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border2)'}
            />
          </div>
          <div>
            <label style={labelStyle}>Unidad</label>
            <input
              style={inputStyle} placeholder="$, kg, libros..."
              value={form.unit}
              onChange={e => set('unit', e.target.value)}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border2)'}
            />
          </div>
        </div>

        {/* Dificultad XP */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Dificultad (XP)</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            {XP_TIERS.map(t => (
              <button
                key={t.value}
                onClick={() => set('xpBase', t.value)}
                title={t.desc}
                style={{
                  background: form.xpBase === t.value ? 'var(--accent-bg)' : 'var(--bg3)',
                  border: `0.5px solid ${form.xpBase === t.value ? 'var(--accent-border)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 4px',
                  color: form.xpBase === t.value ? 'var(--accent)' : 'var(--text2)',
                  fontSize: 11,
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'all 0.15s',
                  lineHeight: 1.4,
                }}
              >
                <div>{t.label}</div>
                <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: "'DM Mono', monospace" }}>{t.value} XP</div>
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            fontSize: 12, color: 'var(--red)', background: 'var(--red-bg)',
            padding: '8px 12px', borderRadius: 'var(--radius-sm)', marginBottom: 12,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          style={{
            width: '100%', background: 'var(--accent)', color: '#000',
            border: 'none', borderRadius: 'var(--radius-sm)',
            padding: '14px', fontSize: 14, fontWeight: 500,
            marginBottom: 10, fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Crear Meta
        </button>
        <button
          onClick={onClose}
          style={{
            width: '100%', background: 'transparent', color: 'var(--text3)',
            border: '0.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
            padding: '11px', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
