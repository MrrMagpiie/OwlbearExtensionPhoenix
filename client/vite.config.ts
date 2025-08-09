import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

// https://vite.dev/config/
export default defineConfig({
  envDir: '../',
  plugins: [react()],
  server:{
    cors:{
      origin: "https://www.owlbear.rodeo",
    },
    allowedHosts: process.env.TUNNEL_URL ? [process.env.TUNNEL_URL] : [],
      proxy: {
      '/api': {
        target: 'http://localhost:3001', // backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
