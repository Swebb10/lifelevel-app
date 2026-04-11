# LifeLevel App 🎯

Tu progreso personal gamificado. Elegante, minimalista, tuya.

---

## 🚀 Instalación (5 minutos)

### Requisitos previos
- **Node.js** instalado → https://nodejs.org (descarga la versión LTS)
- **VS Code** instalado → https://code.visualstudio.com

### Pasos

**1. Abre la carpeta del proyecto en VS Code**
```
Archivo → Abrir Carpeta → selecciona "lifelevel-app"
```

**2. Abre la terminal integrada**
```
Ctrl + ` (o Ver → Terminal)
```

**3. Instala las dependencias (solo la primera vez)**
```bash
npm install
```

**4. Levanta el servidor de desarrollo**
```bash
npm run dev
```

Verás algo así en la terminal:
```
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.X:5173/   ← Esta URL es la de tu celular
```

**5. Abre en tu celular**
- Conecta tu celular al mismo WiFi que tu PC
- Abre el navegador en tu celular
- Escribe la URL de **Network** que aparece en tu terminal
- ¡Listo! La app funciona en tu celular en tiempo real

---

## 📱 Instalar como app en el celular (PWA)

Una vez abierta en el navegador del celular:

**Android (Chrome):**
- Toca los 3 puntos del menú
- "Añadir a pantalla de inicio"
- Se instala como app nativa

**iPhone (Safari):**
- Toca el botón compartir (cuadrado con flecha)
- "Añadir a pantalla de inicio"

---

## 🏗️ Estructura del proyecto

```
lifelevel-app/
├── src/
│   ├── components/
│   │   ├── LevelRing.jsx      ← El anillo SVG animado de nivel
│   │   ├── GoalCard.jsx       ← Tarjeta de cada meta
│   │   ├── UpdateModal.jsx    ← Sheet para actualizar progreso
│   │   ├── RewardModal.jsx    ← Modal de recompensa al subir nivel
│   │   ├── AddGoalSheet.jsx   ← Formulario para crear metas
│   │   └── Toast.jsx          ← Notificación rápida
│   ├── data/
│   │   ├── levels.js          ← Los 10 niveles y cálculos
│   │   ├── rewards.js         ← Mensajes motivacionales por nivel
│   │   └── goalTypes.js       ← Categorías, tipos y tiers de XP
│   ├── hooks/
│   │   └── useAppState.js     ← Estado central + persistencia localStorage
│   ├── utils/
│   │   ├── storage.js         ← Leer/escribir localStorage
│   │   └── xp.js              ← Cálculo de XP y rachas
│   ├── App.jsx                ← App principal (3 tabs)
│   ├── main.jsx               ← Entry point de React
│   └── index.css              ← Variables de tema dark/light + animaciones
├── index.html
├── vite.config.js             ← Config de Vite + PWA
└── package.json
```

---

## 🎮 Cómo usar la app

### Crear una meta
1. Toca **+ Nueva** en el panel principal
2. Elige nombre, categoría, tipo y dificultad
3. Cada dificultad da diferente XP base:
   - Fácil: 50 XP | Normal: 150 XP | Difícil: 300 XP | Épico: 500 XP

### Actualizar progreso
- **Metas numéricas / contador**: toca la tarjeta → mueve el slider → guarda
- **Racha / Hábito diario**: toca la tarjeta → se marca como hecho hoy automáticamente

### Sistema de XP y niveles
- Ganas XP proporcional al avance en cada meta
- Las rachas multiplican el XP ganado (×1.25 desde 7 días, ×1.5 desde 14, ×2 desde 30)
- Al subir de nivel aparece un mensaje motivacional con tu reto del día
- Si rompes una racha, se resetea y aparece una notificación

### Niveles
| # | Nombre        | XP       |
|---|---------------|----------|
| 1 | Aprendiz      | 0        |
| 2 | Iniciado      | 500      |
| 3 | Persistente   | 1,500    |
| 4 | Disciplinado  | 3,000    |
| 5 | Enfocado      | 6,000    |
| 6 | Imparable     | 10,000   |
| 7 | Élite         | 16,000   |
| 8 | Maestro       | 25,000   |
| 9 | Leyenda       | 40,000   |
|10 | Trascendente  | 60,000   |

---

## 💾 Datos y privacidad

Todos tus datos se guardan en **localStorage de tu navegador** — en tu PC, sin servidores, sin cuentas, sin internet requerido después de cargar.

Para hacer backup: en el futuro se puede agregar exportar/importar JSON.

---

## 🛠️ Comandos útiles

```bash
npm run dev      # Servidor de desarrollo (con acceso desde celular)
npm run build    # Genera versión de producción en /dist
npm run preview  # Vista previa del build de producción
```

---

## ✏️ Personalizar

- **Agregar mensajes motivacionales**: edita `src/data/rewards.js`
- **Cambiar colores del tema**: edita las variables en `src/index.css`
- **Agregar categorías**: edita `src/data/goalTypes.js`
- **Ajustar XP de niveles**: edita `src/data/levels.js`
