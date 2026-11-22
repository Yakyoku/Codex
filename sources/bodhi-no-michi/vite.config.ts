import { defineConfig } from 'vite';
import { resolve } from 'node:path';
export default defineConfig({
  base: './',
  build: {
    outDir: resolve(__dirname, '../../games/bodhi-no-michi'),
    emptyOutDir: true,
    target: 'es2022',
    chunkSizeWarningLimit: 1200,
    rollupOptions: { input: { index: resolve(__dirname, 'index.html'), gallery: resolve(__dirname, 'gallery.html') } },
  },
});
