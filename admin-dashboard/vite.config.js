import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3001,
    open: false,
    watch: {
      usePolling: true,
    },
    // Proxy for connecting to shared backend
    proxy: {
      '/api': {
        target: 'http://backend-api:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
