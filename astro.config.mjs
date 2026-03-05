// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import autoTranslateIntegration from './src/integrations/auto-translate';

// Habilitar traducción automática solo si está explícitamente activada
const enableAutoTranslate = process.env.ENABLE_AUTO_TRANSLATE === 'true';

// https://astro.build/config
export default defineConfig({
  site: 'https://portal.unag.edu.hn',
  output: 'static',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [react(), ...(enableAutoTranslate ? [autoTranslateIntegration()] : [])],
});