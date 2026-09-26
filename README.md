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

La dirección de desarrollo `http://192.168.x.x:5173` permite probar la interfaz desde el WiFi, pero **no permite instalar una PWA correctamente**: el navegador del celular requiere HTTPS con un certificado válido. Crear un acceso directo no equivale a instalar la aplicación.

### Preparar la versión instalable

```bash
npm ci
npm run check:pwa
```

Publica el contenido de `dist/` en un alojamiento estático con HTTPS (por ejemplo, tu proyecto de Netlify, Vercel o Cloudflare Pages). Configura `npm run build` como comando de compilación y `dist` como directorio de salida. Sirve `manifest.webmanifest`, `sw.js`, `registerSW.js` y los iconos como archivos reales, sin redirigirlos a HTML. Usa un dominio estable para conservar la instalación y sus datos.

`npm run preview` permite comprobar el build en la computadora usando localhost, pero acceder desde el celular por una IP HTTP sigue sin cumplir el requisito de HTTPS. El soporte PWA de desarrollo está habilitado para pruebas en localhost o HTTPS; no sustituye una publicación de producción.

### Instalar

- **Android / Chrome:** abre la dirección HTTPS publicada, recarga después de actualizar el sitio y utiliza el menú **Instalar aplicación**. Se abrirá en su propia ventana.
- **iPhone / Safari:** abre la dirección HTTPS, pulsa **Compartir → Añadir a pantalla de inicio** y activa **Abrir como app** si aparece esa opción.
- Tras la primera carga completa y la activación del service worker, la interfaz y los iconos quedan disponibles sin conexión. Las fuentes externas pueden sustituirse por las fuentes locales del sistema.

Los datos se guardan por navegador y origen (protocolo, dominio y puerto). Cambiar de una IP HTTP a un dominio HTTPS no traslada automáticamente las metas ni las notas. No borres los datos del navegador ni la instalación anterior para intentar resolver un fallo de instalación.

### Verificaciones

`npm run check:pwa` comprueba el manifest de producción, los tamaños reales de los PNG, el registro del service worker y la inclusión de los archivos en la caché sin conexión. La instalación final debe probarse en el navegador del celular desde la URL HTTPS publicada.

Los iconos se versionan en `public/`. Para regenerar el monograma en Windows: `powershell -File scripts/generate-icons.ps1`.

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

