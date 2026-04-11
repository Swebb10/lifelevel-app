// Mensajes motivacionales por nivel.
// Mezcla de estoicismo, mentalidad de alto rendimiento y reflexión personal.

export const REWARDS = {
  1: {
    icon: '◈',
    title: '"El viaje de mil millas comienza con un solo paso."',
    author: '— Lao Tzu',
    msg: 'Acabas de tomar la decisión que la mayoría nunca toma: empezar. No mañana, no el lunes. Hoy. Ese acto tan simple es lo que separa a quienes hablan de quienes construyen.',
    action: 'Define tus primeras 3 metas con honestidad. No lo que suena bien — lo que realmente quieres.',
    color: 'blue',
  },
  2: {
    icon: '◉',
    title: '"El comienzo es la parte más importante de cualquier trabajo."',
    author: '— Platón',
    msg: 'Nivel 2 no se gana solo con tiempo — se gana con acción. Ya tienes progreso real. Ahora viene la parte donde la mayoría abandona: el período en que los resultados aún no se ven, pero el trabajo ya se hace. Tú seguiste.',
    action: 'Abre esta app cada mañana antes de abrir redes sociales. Ese ritual de 2 minutos construirá más disciplina que cualquier motivación.',
    color: 'teal',
  },
  3: {
    icon: '▲',
    title: '"La disciplina es la brecha entre metas y logros."',
    author: '— Jim Rohn',
    msg: 'Persistente. No es un título vacío. Llegaste aquí porque seguiste en los días que no querías. Esos días cuentan doble — porque el músculo de la disciplina se forja exactamente en la incomodidad, no a pesar de ella.',
    action: 'Identifica hoy cuál de tus metas estás evitando actualizar. Esa es exactamente la que necesitas trabajar.',
    color: 'green',
  },
  4: {
    icon: '✦',
    title: '"Sufre el dolor de la disciplina o el dolor del arrepentimiento."',
    author: '— Jim Rohn',
    msg: 'Disciplinado. Esto ya no es suerte ni motivación — es un sistema. A este nivel, las personas que te rodean empiezan a notar algo diferente en ti, aunque no puedan nombrarlo. Es el compuesto del esfuerzo diario haciéndose visible.',
    action: 'Sube el estándar de al menos una meta hoy. Si ya ibas bien, ve más lejos. Los cómodos no llegan al siguiente nivel.',
    color: 'amber',
  },
  5: {
    icon: '◆',
    title: '"No midas tu riqueza por el dinero que tienes, sino por las cosas de las que puedes prescindir."',
    author: '— Epicuro',
    msg: 'Enfocado. Sabes qué quieres. Sabes por qué lo quieres. Y más importante: sabes lo que estás dispuesto a sacrificar para conseguirlo. Eso es claridad. Y la claridad en un mundo distraído es una ventaja injusta.',
    action: 'Escribe en papel: ¿Qué versión tuya de hace 6 meses pensaría de quien eres hoy? Léelo. Guárdalo.',
    color: 'purple',
  },
  6: {
    icon: '★',
    title: '"No busques que todo lo que sucede suceda como tú quieres, sino quiere que todo suceda como sucede."',
    author: '— Epicteto',
    msg: 'Imparable. A este nivel ya no dependes de la motivación — operas desde la identidad. No haces ejercicio porque tienes ganas; lo haces porque eres alguien que hace ejercicio. Ese cambio de mentalidad es el más poderoso de todos.',
    action: 'Mentoriza a alguien. Enseñar lo que sabes es la forma más rápida de dominarlo completamente.',
    color: 'gold',
  },
  7: {
    icon: '⬡',
    title: '"Pierde una hora por la mañana y la pasarás buscándola el resto del día."',
    author: '— Richard Whately',
    msg: 'Élite. Estás en el 1% de quienes comienzan proyectos de mejora personal y llegan aquí. No el 1% de los ricos ni de los talentosos — el 1% de los que no se rinden cuando deja de ser fácil. Eso no tiene precio.',
    action: 'Protege tu primera hora del día como si fuera tu activo más valioso. Porque lo es.',
    color: 'blue',
  },
  8: {
    icon: '◈',
    title: '"La grandeza no es este don maravilloso y especial. Es simplemente trabajar en lo tuyo más que nadie."',
    author: '— Will Smith',
    msg: 'Maestro. Ya no se trata de probarte algo a ti mismo — se trata de construir algo que dure. Los maestros no trabajan por validación externa. Trabajan porque el trabajo mismo es la recompensa.',
    action: 'Define tu legado. No lo que quieres tener — lo que quieres haber construido. Escríbelo.',
    color: 'teal',
  },
  9: {
    icon: '✦',
    title: '"Confina tu tiempo y energía a las pocas cosas más importantes. Ignora todo lo demás."',
    author: '— Gary Keller',
    msg: 'Leyenda. Este nivel no se explica — se vive. Las personas a tu alrededor no entienden cómo haces lo que haces. La respuesta es simple: llevas meses eligiendo lo difícil cuando era más fácil no hacerlo.',
    action: 'Elimina hoy una cosa de tu vida que sabes que te resta más de lo que te suma. Sin negociación.',
    color: 'purple',
  },
  10: {
    icon: '◉',
    title: '"Cuando hayas terminado de cambiar, habrás terminado."',
    author: '— Benjamin Franklin',
    msg: 'Trascendente. No hay más niveles porque este no es el final — es el principio de algo que va más allá de los sistemas. Eres la prueba viviente de que el cambio real es posible. Ahora tu obligación es diferente: mostrarle a otros que ellos también pueden.',
    action: 'El juego ahora es diferente. Define tus próximas metas sin límite. ¿Qué harías si supieras que no puedes fallar?',
    color: 'gold',
  },
}

// Mensajes de racha por días consecutivos
export const STREAK_REWARDS = [
  { days: 3,   msg: '3 días seguidos. El hábito empieza a formarse.' },
  { days: 7,   msg: '1 semana. Ya no es casualidad — es patrón.' },
  { days: 14,  msg: '2 semanas. Tu cerebro ya registra esto como identidad.' },
  { days: 21,  msg: '21 días. La ciencia dice que el hábito ya está instalado.' },
  { days: 30,  msg: '1 mes de racha. Brutal. Absolutamente brutal.' },
  { days: 60,  msg: '60 días. Eres diferente de quien empezó esto.' },
  { days: 100, msg: '100 días. Esto ya no es una racha. Es quien eres.' },
]

// Mensajes de actualización diaria (aleatorios al guardar progreso)
export const UPDATE_MESSAGES = [
  '¿Ves? No era tan difícil.',
  'Cada actualización es una victoria.',
  'El que actúa gana. Tú actuaste.',
  'Consistencia > intensidad.',
  'Otro día que no tiraste la toalla.',
  'El movimiento crea momentum.',
  'Pequeños pasos, grandes resultados.',
  'Hoy sumaste. Mañana sumas de nuevo.',
  'La disciplina se está convirtiendo en libertad.',
  'Este momento importa. Acabas de probarlo.',
]
