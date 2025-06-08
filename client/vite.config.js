import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import rewriteAll from 'vite-plugin-rewrite-all';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), rewriteAll()],
  server: {
    host: '0.0.0.0'
  }
})
