import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { BACKEND_URI } from './src/config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/callback': {
        target: BACKEND_URI, // Replace with your actual OAuth provider URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/callback/, '')
      },
      '/yt-music': {
        target: 'https://music.youtube.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/yt-music/, ''),
      },
    },
  }
})
