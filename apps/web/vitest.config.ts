import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@cicero-zcash/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
      '@cicero-zcash/react': path.resolve(__dirname, '../../packages/cicero/src/index.ts'),
    },
  },
});
