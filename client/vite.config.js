import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), require('@tailwindcss/typography')],
  server: {
    host: '0.0.0.0', // Allow external connections
    allowedHosts: [
      '22e5-2401-4900-5dba-32ff-4599-bd1f-9dd1-e92d.ngrok-free.app'
    ]
  }
})
