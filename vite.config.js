import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const baseScss = fileURLToPath(new URL('./src/assets/base.scss', import.meta.url));
const momentWithLocales = fileURLToPath(
  new URL('./node_modules/moment/min/moment-with-locales.js', import.meta.url)
);

// The API lives on its own origin in production (https://api.wybornie.org).
// Override with VITE_API_URL at build time, e.g.:
//   VITE_API_URL=http://localhost:3000 npm run build
export default defineConfig({
  plugins: [vue()],
  // Relative base so the same build works both at an apex custom domain
  // (https://wybornie.org) and from a project path
  // (https://wybornieorg.github.io/wybornieorg-frontend/). Safe because the app
  // uses hash routing, so the document path never changes.
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // moment ships locales as separate UMD files that `require('../moment')`.
      // Bundlers can end up giving them their own moment copy, which makes
      // `moment.locale('pl')` silently no-op. Point at the single-file build
      // that has every locale compiled in instead.
      moment: momentWithLocales
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Make the design-token variables ($color-base, ...) available everywhere.
        additionalData: `@use "${baseScss}" as *;\n`
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1500
  }
});