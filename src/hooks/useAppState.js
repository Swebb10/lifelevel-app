import { useState, useEffect, useCallback } from 'react'
import { loadState, saveState, toDateStr } from '../utils/storage.js'
import { calcXPForUpdate, updateStreak, checkBrokenStreaks } from '../utils/xp.js'
import { getLevel } from '../data/levels.js'
import { UPDATE_MESSAGES } from '../data/rewards.js'

export function useAppState() {
  const [state, setStateRaw] = useState(() => {
    const s = loadState()
    // Al cargar, verificar rachas rotas
    return { ...s, goals: checkBrokenStreaks(s.goals) }
  })

  // Persistir en localStorage cada vez que cambia el estado
  useEffect(() => {
    saveState(state)
  }, [state])

  // Aplicar tema al document
  useEffect(() => {
    document.documentElement.className = state.theme === 'light' ? 'light' : ''
    document.body.className = state.theme === 'light' ? 'light' : ''
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

  const updateGoalProgress = useCallback((id, newValue) => {
    setState(prev => {
      const goals = prev.goals.map(g => {
        if (g.id !== id) return g

        const clampedValue = Math.min(newValue, g.target)
        const xpGained     = calcXPForUpdate(g, clampedValue)
        const streakData   = updateStreak(g)
        const isCompleted  = clampedValue >= g.target && !g.completedAt

        return {
          ...g,
          current:     clampedValue,
          streak:      streakData.streak,
          lastUpdated: streakData.lastUpdated,
          completedAt: isCompleted ? new Date().toISOString() : g.completedAt,
          xpLastGained: xpGained,
        }
      })

      const updatedGoal = goals.find(g => g.id === id)
      const xpGained    = updatedGoal?.xpLastGained || 0
      const newXP       = prev.xp + xpGained
      const newTotalXP  = (prev.totalXP || 0) + xpGained
      const newLevelN   = getLevel(newXP).n
      const leveledUp   = newLevelN > prev.currentLevel

      return {
        ...prev,
        goals,
        xp:           newXP,
        totalXP:      newTotalXP,
        currentLevel: newLevelN,
        lastLevelUp:  leveledUp ? newLevelN : prev.lastLevelUp,
        pendingLevelUp: leveledUp ? newLevelN : prev.pendingLevelUp,
        lastUpdateMsg: UPDATE_MESSAGES[Math.floor(Math.random() * UPDATE_MESSAGES.length)],
      }
    })
  }, [setState])

  const markHabitDone = useCallback((id) => {
    setState(prev => {
      const today = toDateStr()
      const goals = prev.goals.map(g => {
        if (g.id !== id) return g
        const alreadyDoneToday = g.lastUpdated && toDateStr(new Date(g.lastUpdated)) === today
        if (alreadyDoneToday) return g

        const streakData = updateStreak(g)
        const xpGained   = Math.round(g.xpBase * 0.1 * (1 + (streakData.streak / 10)))

        return {
          ...g,
          current:      (g.current || 0) + 1,
          streak:        streakData.streak,
          lastUpdated:   streakData.lastUpdated,
          xpLastGained:  xpGained,
        }
      })

      const updatedGoal = goals.find(g => g.id === id)
      const xpGained    = updatedGoal?.xpLastGained || 0
      const newXP       = prev.xp + xpGained
      const newLevelN   = getLevel(newXP).n
      const leveledUp   = newLevelN > prev.currentLevel

      return {
        ...prev,
        goals,
        xp:           newXP,
        totalXP:      (prev.totalXP || 0) + xpGained,
        currentLevel: newLevelN,
        pendingLevelUp: leveledUp ? newLevelN : prev.pendingLevelUp,
        lastUpdateMsg: UPDATE_MESSAGES[Math.floor(Math.random() * UPDATE_MESSAGES.length)],
      }
    })
  }, [setState])

  const clearPendingLevelUp = useCallback(() => {
    setState(prev => ({ ...prev, pendingLevelUp: null }))
  }, [setState])

  // ── Editar meta ────────────────────────────────────────────
  const editGoal = useCallback((id, changes) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === id ? { ...g, ...changes } : g),
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
  const toggleTheme = useCallback(() => {
    setState(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }))
  }, [setState])

  const resetAll = useCallback(() => {
    if (window.confirm('¿Seguro que quieres borrar todo el progreso? Esta acción no se puede deshacer.')) {
      localStorage.clear()
      window.location.reload()
    }
  }, [])

  return {
    state,
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
