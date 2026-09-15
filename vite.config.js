import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tooling from './config/tooling.json' with { type: 'json' };
export default defineConfig({
  plugins: [react()],
  server: { host: tooling.host, port: tooling.devPort, strictPort: true },
  preview: { host: tooling.host, port: tooling.previewPort, strictPort: true },
  build: { outDir: 'dist', sourcemap: false },
});
