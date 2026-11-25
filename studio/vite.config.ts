import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { motionLive } from './server/vite/motionLive.ts';
import { trainingGround } from './server/vite/trainingGround.ts';
import { SERVER_PORT, UI_PORT } from './shared/ports.ts';

const path = (relative: string) => fileURLToPath(new URL(relative, import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss(), motionLive(path('..')), trainingGround(path('..'))],
  resolve: {
    alias: { '@': path('./src'), '@game': path('../src'), '@shared': path('./shared') },
  },
  server: {
    port: UI_PORT,
    strictPort: true,
    fs: { allow: [path('..')] },
    proxy: { '/api': `http://127.0.0.1:${SERVER_PORT}` },
  },
});
