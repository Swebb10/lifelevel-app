export const CATEGORIES = {
  fin: { label: 'Finanzas',       icon: '$',  color: 'blue'   },
  fit: { label: 'Físico',         icon: '↑',  color: 'green'  },
  str: { label: 'Racha / Hábito', icon: '◎',  color: 'red'    },
  lrn: { label: 'Aprendizaje',    icon: '▲',  color: 'purple' },
  men: { label: 'Mental',         icon: '◉',  color: 'teal'   },
  rel: { label: 'Relaciones',     icon: '♦',  color: 'pink'   },
}

export const GOAL_TYPES = {
  num:    { label: 'Numérico',      desc: 'Avanza hacia un número meta (dinero, kg, páginas...)' },
  streak: { label: 'Racha (días)',  desc: 'Días consecutivos sin romper el hábito' },
  habit:  { label: 'Hábito diario', desc: 'Marca como hecho cada día que lo cumples' },
  count:  { label: 'Contador',      desc: 'Acumula unidades hasta llegar a la meta' },
}

export const XP_TIERS = [
  { value: 50,  label: 'Fácil',   desc: 'Tarea pequeña o rutinaria' },
  { value: 150, label: 'Normal',  desc: 'Requiere esfuerzo consistente' },
  { value: 300, label: 'Difícil', desc: 'Cambio significativo de vida' },
  { value: 500, label: 'Épico',   desc: 'Meta de vida, transformadora' },
]
