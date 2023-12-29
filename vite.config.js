import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      // Add the following to enable CORS
      cors: {
        origin: '*',
      },
    },
  },
  plugins: [react()],
});

