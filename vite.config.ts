import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Served as a GitHub Pages project site at
  // progeroffline.github.io/propresentor-formatter/, so production assets
  // need that subpath baked in; the dev server stays at "/" for local work.
  base: command === "build" ? "/propresentor-formatter/" : "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}))
