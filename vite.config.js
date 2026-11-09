/* global process */
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves under /spendwrapped/; Vercel and dev serve at the root.
  base: process.env.GITHUB_ACTIONS ? '/spendwrapped/' : '/',
})
