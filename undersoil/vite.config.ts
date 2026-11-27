import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// 相対パスで出力する（Netlify のどの URL に置いても動く。Playwright の仮の住所でも動く）
export default defineConfig({
  base: './',
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        vr: resolve(__dirname, 'vr/index.html'),
        diag: resolve(__dirname, 'diag/index.html'),
        progress: resolve(__dirname, 'progress/index.html'),
        stage2: resolve(__dirname, 'stage2/index.html'),
      },
    },
  },
});
