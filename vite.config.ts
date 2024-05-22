import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from "vite-plugin-pwa"
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import deadFile from 'vite-plugin-deadfile';
import path from "node:path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    deadFile({
      root: 'src',
    }),
    react(),
    VitePWA({
      srcDir: "src",
      filename: "sw.ts",
      strategies: "injectManifest",
      injectRegister: false,
      manifest: false,
      injectManifest: {
        injectionPoint: undefined,
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
    }),
    nodePolyfills(),
    TanStackRouterVite({
      routesDirectory: 'src/routes',
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0'
  }
});