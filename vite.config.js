import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      input: { main: 'app.html' },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 80,
    host: true,
    allowedHosts: 'all',
    fs: {
      strict: false,
    },
    headers: {
      'ngrok-skip-browser-warning': 'true',
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 4173,
    allowedHosts: 'all',
    headers: {
      'ngrok-skip-browser-warning': 'true',
    },
  },
});
