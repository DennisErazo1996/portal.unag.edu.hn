// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://portal.unag.edu.hn',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()],
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true }
  })
});