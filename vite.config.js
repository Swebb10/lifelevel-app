import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png'],
      devOptions: { enabled: true },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        cleanupOutdatedCaches: true,
        navigateFallback: 'index.html',
      },
      manifest: {
        id: './',
        start_url: './',
        scope: './',
        lang: 'es',
        name: 'LifeLevel',
        short_name: 'LifeLevel',
        description: 'Tu progreso personal gamificado',
        theme_color: '#101211',
        background_color: '#101211',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      }
    })
  ],
  server: {
    host: true
  }
})
