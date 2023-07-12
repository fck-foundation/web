import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import mkcert from "vite-plugin-mkcert";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import viteCompression from "vite-plugin-compression";
import { ViteMinifyPlugin } from "vite-plugin-minify";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import pluginRewriteAll from "vite-plugin-rewrite-all";
import { resolve } from "path";
import { fileURLToPath } from "url";

export default defineConfig({
  plugins: [
    svgr(),
    react(),
    mkcert(),
    tsconfigPaths(),
    viteCompression(),
    ViteMinifyPlugin(),
    pluginRewriteAll(),
    VitePWA({
      base: "/",
      injectRegister: "auto",
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      devOptions: {
        // enabled: true,
        type: "module",
      },
      includeAssets: [
        "icons/icon-72x72.png",
        "icons/icon-96x96.png",
        "icons/icon-128x128.png",
        "icons/icon-144x144.png",
        "icons/icon-152x152.png",
        "icons/icon-192x192.png",
        "icons/icon-384x384.png",
        "icons/icon-512x512.png",
      ],
      // strategies: 'injectManifest',
      manifest: {
        name: "Find & Check",
        short_name: "Find & Check",
        description: "Find & Check Foundation description",
        theme_color: "#2eab8f",
        background_color: "#121212",
        display: "fullscreen",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "icons/icon-72x72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "icons/icon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "icons/icon-144x144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "icons/icon-152x152.png",
            sizes: "152x152",
            type: "image/png",
          },
          {
            src: "icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "./runtimeConfig": "./runtimeConfig.browser",
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    // alias: {
    //   // find: /^~(.*)$/,
    //   "./runtimeConfig": "./runtimeConfig.browser",
    //   "#": fileURLToPath(new URL("./src", import.meta.url)),
    //   // "@": path.resolve(__dirname, "src"),
    // },
  },
  build: {
    outDir: "docs",
    // rollupOptions: {
    //   input: {
    //     main: resolve(__dirname, "index.html"),
    //     nested: resolve(__dirname, "./index.html"),
    //   },
    // },
  },
  base: "/",
  server: {
    fs: {
      allow: ["../sdk", "./"],
    },
    https: true,
  },
  preview: {
    port: 8080,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
});
