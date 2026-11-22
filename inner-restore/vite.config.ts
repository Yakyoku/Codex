import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// 画面版 /、VR 版 /vr/、実機診断 /diag/。進捗確認 /progress/ は scripts/build-progress.mjs が作る。
export default defineConfig({
  base: '/',
  define: { __BUILD__: JSON.stringify(new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '')) },
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        vr: resolve(__dirname, 'vr/index.html'),
        diag: resolve(__dirname, 'diag/index.html'),
      },
    },
  },
});
