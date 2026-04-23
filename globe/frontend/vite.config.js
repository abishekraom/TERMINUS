import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to the VDIE backend during development
      '/vessels': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/lod': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/tracks': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
