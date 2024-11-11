import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/yt-music': {
        target: 'https://music.youtube.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/yt-music/, ''),
      },
    },
  }
})
