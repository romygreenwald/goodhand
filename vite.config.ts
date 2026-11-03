import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative so the built app runs from any sub path, not just a domain root.
  base: "./",
  plugins: [react()],
  resolve: {
    alias: { "@": new URL("./src/", import.meta.url).pathname },
  },
  server: { port: 5181, strictPort: false },
});
