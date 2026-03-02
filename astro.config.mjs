// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import autoTranslateIntegration from './src/integrations/auto-translate';

// https://astro.build/config
export default defineConfig({
  site: 'https://portal.unag.edu.hn',
  output: 'static',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    prefixDefaultLocale: false,
  },
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [react(), autoTranslateIntegration()],
});