export const LEVELS = [
  { n: 1,  name: 'Aprendiz',     xp: 0     },
  { n: 2,  name: 'Iniciado',     xp: 500   },
  { n: 3,  name: 'Persistente',  xp: 1500  },
  { n: 4,  name: 'Disciplinado', xp: 3000  },
  { n: 5,  name: 'Enfocado',     xp: 6000  },
  { n: 6,  name: 'Imparable',    xp: 10000 },
  { n: 7,  name: 'Élite',        xp: 16000 },
  { n: 8,  name: 'Maestro',      xp: 25000 },
  { n: 9,  name: 'Leyenda',      xp: 40000 },
  { n: 10, name: 'Trascendente', xp: 60000 },
]

export function getLevel(xp) {
  let current = LEVELS[0]
  for (const l of LEVELS) {
    if (xp >= l.xp) current = l
  }
  return current
}

export function getNextLevel(xp) {
  for (const l of LEVELS) {
    if (xp < l.xp) return l
  }
  return null
}

export function getLevelProgress(xp) {
  const current = getLevel(xp)
  const next    = getNextLevel(xp)
  if (!next) return { pct: 100, current, next: null }
  const pct = Math.round(((xp - current.xp) / (next.xp - current.xp)) * 100)
  return { pct, current, next }
}
