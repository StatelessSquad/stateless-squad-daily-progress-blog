import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://statelesssquad.github.io',
  base: '/stateless-squad-daily-progress-blog/',
  vite: { plugins: [tailwindcss()] },
});
