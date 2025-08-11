import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    // Memory optimization
    hmr: {
      overlay: false, // Disable error overlay to save memory
    },
    // Reduce memory usage
    watch: {
      usePolling: false,
      interval: 1000,
    },
  },
  build: {
    // Memory optimization for builds
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lucide-react'],
        },
      },
    },
  },
});
