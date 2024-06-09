import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import react from "@vitejs/plugin-react-swc";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), reactRefresh()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
          if (id.includes("src/components")) {
            return "components";
          }
        },
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://sistema-inventario-api.vercel.app/",
        changeOrigin: true,
      },
    },
    fs: { strict: false },
  },
});
