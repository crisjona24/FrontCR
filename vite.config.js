import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  proxy: {
    '/api': {
      target: 'https://django-server-production-3a07.up.railway.app/',
      // Add the following to enable CORS
      cors: {
        origin: '*',
      },
    },
  },
  plugins: [react()],
});

