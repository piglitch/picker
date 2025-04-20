import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    react({include: "**/*.tsx"}),
    checker({ typescript: false }),
  ],
 server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
