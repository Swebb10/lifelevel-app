import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { THEMES, getTheme } from '../data/themes.js'
import { useDialog } from '../hooks/useDialog.js'
import './ThemePicker.css'

function ThemeDialog({ themeId, onSelect, onClose }) {
  const ref = useDialog(onClose)
  const current = getTheme(themeId)
  return createPortal(
    <div className="modal-overlay theme-overlay" onClick={onClose}>
      <section className="theme-dialog" role="dialog" aria-modal="true" aria-labelledby="theme-dialog-title" aria-describedby="theme-dialog-description" ref={ref} tabIndex={-1} onClick={event => event.stopPropagation()}>
        <header className="theme-dialog-heading">
          <div><span className="eyebrow">APARIENCIA</span><h2 id="theme-dialog-title">Tu espacio, a tu estilo.</h2></div>
          <button className="theme-close" aria-label="Cerrar selector de temas" onClick={onClose}>×</button>
        </header>
        <p id="theme-dialog-description">Elige una paleta para toda la app. Tu elección se guarda automáticamente.</p>
        <div className="theme-options" role="group" aria-label="Temas disponibles">
          {THEMES.map(theme => <button type="button" key={theme.id} className="theme-option" aria-label={`Tema ${theme.name}`} aria-pressed={current.id === theme.id} onClick={() => onSelect(theme.id)}>
            <span className="theme-preview" data-theme={theme.id} aria-hidden="true">
              <span className="theme-preview-sidebar"><i /><i /><i /></span>
              <span className="theme-preview-main"><span className="theme-preview-heading">LifeLevel<span>↗</span></span><span className="theme-preview-hero"><i /><i /><b /></span><span className="theme-preview-cards"><i /><i /><i /></span></span>
              <span className="theme-preview-dots"><i /><i /><i /></span>
            </span>
            <span className="theme-option-label"><strong>{theme.name}</strong><span className="theme-selected" aria-hidden="true">{current.id === theme.id ? '✓' : ''}</span></span>
            <span className="theme-option-description">{theme.description}</span>
          </button>)}
        </div>
        <footer className="theme-dialog-footer"><span role="status">Tema actual: <strong>{current.name}</strong></span><button className="primary" onClick={onClose}>Listo</button></footer>
      </section>
    </div>, document.body,
  )
}

export default function ThemePicker({ themeId, onSelect }) {
  const [open, setOpen] = useState(false)
  const current = getTheme(themeId)
  return <>
    <button className="theme-trigger" aria-label={`Elegir tema. Actual: ${current.name}`} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
      <span className="theme-trigger-swatch" aria-hidden="true"><i /><i /><i /></span>
      <span className="theme-trigger-copy"><span>Temas</span><strong>{current.name}</strong></span><span className="theme-trigger-arrow" aria-hidden="true">↗</span>
    </button>
    {open && <ThemeDialog themeId={themeId} onSelect={onSelect} onClose={() => setOpen(false)} />}
  </>
}
