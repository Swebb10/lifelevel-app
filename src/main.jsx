import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './themes.css'
import { applyTheme } from './data/themes.js'
import { loadState } from './utils/storage.js'

// Apply the saved palette before the first React render, including portal dialogs.
applyTheme(loadState().theme)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
