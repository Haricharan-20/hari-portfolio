import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // The dev/preview servers are used behind sandbox host names as well as
  // localhost, so the host allow-list is left open for previews only.
  server: { allowedHosts: true },
  preview: { allowedHosts: true },
  build: {
    target: 'es2020',
    cssTarget: 'chrome100',
    assetsInlineLimit: 2048,
  },
});
