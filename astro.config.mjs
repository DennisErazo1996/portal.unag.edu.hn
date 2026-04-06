// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import autoTranslateIntegration from './src/integrations/auto-translate';

const enableAutoTranslate = process.env.ENABLE_AUTO_TRANSLATE === 'true';

export default defineConfig({
  site: 'https://unag.edu.hn',
  output: 'static',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [react(), ...(enableAutoTranslate ? [autoTranslateIntegration()] : [])],
});