import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": "http://localhost:8080/",
      "/api": "http://localhost:8080/",
      "/anthropic": "http://localhost:8080",
    },
  },
});
