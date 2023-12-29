import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cors from "cors";

export default {
  ...,
  plugins: [
    cors({
      origin: "*",
    }),
  ],
};

// https://vitejs.dev/config/
export default defineConfig({
 // base: '/client/',
  plugins: [react()],
})
