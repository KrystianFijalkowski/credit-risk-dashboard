import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Forward any request starting with /api to the backend on port 4000.
    // This lets the frontend call "/api/metrics" without running into CORS.
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
});
