import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/callback': {
        target: 'https://api-spotify-ai.onrender.com', // Replace with your actual OAuth provider URL
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
