import react from '@vitejs/plugin-react';
import typescript from '@rollup/plugin-typescript';
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
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'EChartsx',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'fast-deep-equal/react',
        /^echarts/,
      ],
    },
  },
});
