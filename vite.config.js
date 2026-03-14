import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Automated deployment triggered for Hostinger root domain.
// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
})
