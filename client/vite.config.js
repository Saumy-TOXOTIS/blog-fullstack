// client/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // We REMOVED tailwindcss() from here.
  plugins: [react()], 
  
  // The server config can remain for your local ngrok setup.
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      '22e5-2401-4900-5dba-32ff-4599-bd1f-9dd1-e92d.ngrok-free.app'
    ]
  }
})