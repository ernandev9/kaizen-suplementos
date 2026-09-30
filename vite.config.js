import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build`         -> build normal (pasta dist/ com JS/CSS separados), ideal para Vercel/Netlify
// `npm run build:single`  -> gera um único index.html com tudo embutido
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [react(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  build: mode === 'single' ? { assetsInlineLimit: 100000000 } : {},
}));
