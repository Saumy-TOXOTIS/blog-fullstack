import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import rewriteAll from 'vite-plugin-rewrite-all';
import singleSpa from 'vite-plugin-single-spa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), rewriteAll(),singleSpa({
      type: 'root',
      imo: false, // Important for this use case
    })],
  server: {
    host: '0.0.0.0'
  }
})
