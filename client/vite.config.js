// client/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss' // Corrected import

// https://vitejs.dev/config/
export default defineConfig({
  // The tailwindcss() plugin will automatically find and use your new tailwind.config.js
  plugins: [react(), tailwindcss()], 
  
  // You can remove the server config for deployment, but it's fine to leave it.
  // Vercel will ignore it.
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      '22e5-2401-4900-5dba-32ff-4599-bd1f-9dd1-e92d.ngrok-free.app'
    ]
  }
})