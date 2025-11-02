import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/instantpay/',  // 👈 ADD THIS LINE (your repo name)
  build: {
    outDir: 'dist'
  }
})
