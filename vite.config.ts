import typescript from '@rollup/plugin-typescript';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    typescript({
      exclude: ['App.tsx', 'main.tsx'],
      rootDir: 'src',
    }),
    visualizer(),
  ],
  optimizeDeps: {
    include: ['react/jsx-runtime'],
  },
});
