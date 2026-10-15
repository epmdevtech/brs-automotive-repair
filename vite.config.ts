import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
export default defineConfig(() => ({
  server: {
    port: 5210,
    strictPort: true,
    host: "0.0.0.0",
    watch: {
      usePolling:
        process.env.VITE_USE_POLLING === "true" || process.env.CHOKIDAR_USEPOLLING === "true",
      interval: 100,
    },
    hmr: {
      clientPort: 5210,
    },
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@": "/src",
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      server: { entry: "server" },
    }),
    react(),
  ],
}));
