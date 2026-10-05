import { useState, useEffect, useCallback } from 'react'
import { loadState, saveState, DEFAULT_STATE } from '../utils/storage.js'
import { checkBrokenStreaks } from '../utils/xp.js'

import { applyProgress } from '../utils/progress.js'
import { applyFinance } from '../utils/finance.js'

export function useAppState() {
  const [storageError, setStorageError] = useState(false)
  const [state, setStateRaw] = useState(() => {
    const s = loadState()
    // Al cargar, verificar rachas rotas
    return { ...s, goals: checkBrokenStreaks(s.goals) }
  })

  // Persistir en localStorage cada vez que cambia el estado
  useEffect(() => {
    setStorageError(!saveState(state))
  }, [state])

  // Aplicar tema al document
  useEffect(() => {
    document.documentElement.classList.toggle('light', state.theme === 'light')
    document.querySelector('meta[name=theme-color]')?.setAttribute('content', state.theme === 'light' ? '#f6f7f2' : '#101211')
  }, [state.theme])

  const setState = useCallback((updater) => {
    setStateRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }
      return next
    })
  }, [])

  // ── Metas ──────────────────────────────────────────────

  const addGoal = useCallback((goalData) => {
    setState(prev => ({
      ...prev,
      goals: [
        ...prev.goals,
        {
          id:          prev.nextGoalId,
          ...goalData,
          current:     0,
          streak:      0,
          lastUpdated: null,
          createdAt:   new Date().toISOString(),
          completedAt: null,
        }
      ],
      nextGoalId: prev.nextGoalId + 1,
    }))
  }, [setState])

  const deleteGoal = useCallback((id) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== id),
    }))
  }, [setState])

  const updateGoalProgress = useCallback((id, value) => {
    setState(prev => applyProgress(prev, id, value))
  }, [setState])

  const markHabitDone = useCallback((id) => {
    setState(prev => applyProgress(prev, id, null, true))
  }, [setState])
  const clearPendingLevelUp = useCallback(() => {
    setState(prev => ({ ...prev, pendingLevelUp: null }))
  }, [setState])

  // ── Editar meta ────────────────────────────────────────────
  const editGoal = useCallback((id, changes) => {
    if (!changes.name?.trim() || !changes.unit?.trim() || !Number.isFinite(changes.target) || changes.target <= 0) return
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === id ? { ...g, ...changes, completedAt: g.current >= changes.target ? g.completedAt || new Date().toISOString() : null } : g),
    }))
  }, [setState])

  // ── Nota fija de meta ──────────────────────────────────────
  const saveGoalNote = useCallback((id, note) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === id ? { ...g, note } : g),
    }))
  }, [setState])

  // ── Entradas de bitácora de meta ───────────────────────────
  const addGoalEntry = useCallback((id, text) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(g => {
        if (g.id !== id) return g
        const entries = g.entries || []
        return { ...g, entries: [...entries, { text, date: new Date().toISOString() }] }
      }),
    }))
  }, [setState])

  const deleteGoalEntry = useCallback((id, index) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(g => {
        if (g.id !== id) return g
        const entries = (g.entries || []).filter((_, i) => i !== index)
        return { ...g, entries }
      }),
    }))
  }, [setState])

  // ── Notas generales ────────────────────────────────────────
  const addNote = useCallback(({ title, content, cat }) => {
    setState(prev => ({
      ...prev,
      notes: [
        ...( prev.notes || []),
        {
          id:        prev.nextNoteId || 1,
          title, content, cat,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ],
      nextNoteId: (prev.nextNoteId || 1) + 1,
    }))
  }, [setState])

  const deleteNote = useCallback((id) => {
    setState(prev => ({ ...prev, notes: (prev.notes || []).filter(n => n.id !== id) }))
  }, [setState])

  const updateNote = useCallback((id, changes) => {
    setState(prev => ({
      ...prev,
      notes: (prev.notes || []).map(n =>
        n.id === id ? { ...n, ...changes, updatedAt: new Date().toISOString() } : n
      ),
    }))
  }, [setState])

  // ── Tema y reset ───────────────────────────────────────────
  const financeAction = useCallback((action) => {
    // Validate before closing a form; each action is an atomic ledger change.
    const finance = applyFinance(state.finance, action)
    setState(prev => ({ ...prev, finance }))
  }, [state.finance, setState])
  const toggleTheme = useCallback(() => {
    setState(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }))
  }, [setState])

  const resetAll = useCallback(() => {
    if (window.confirm('¿Seguro que quieres borrar todo, incluidas tus metas, notas y finanzas? Esta acción no se puede deshacer.')) {
      setState(prev => ({ ...DEFAULT_STATE, goals: [], notes: [], theme: prev.theme, createdAt: new Date().toISOString() }))
    }
  }, [])

  return {
    state,
    storageError,
    financeAction,
    addGoal,
    deleteGoal,
    editGoal,
    updateGoalProgress,
    markHabitDone,
    clearPendingLevelUp,
    saveGoalNote,
    addGoalEntry,
    deleteGoalEntry,
    addNote,
    deleteNote,
    updateNote,
    toggleTheme,
    resetAll,
  }
}
