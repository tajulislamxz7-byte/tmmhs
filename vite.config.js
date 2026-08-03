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
        secure: false,
        // Log proxy errors to help debugging
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('[Proxy Error]', err.message);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('[Proxy Request]', req.method, req.url);
          });
        },
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
