// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import path from 'path';

export default defineConfig({
  base: '/stateless-squad-daily-progress-blog/',
  site: 'https://statelesssquad.github.io/stateless-squad-daily-progress-blog/',
  theme: 'astro-paper',
  vite: {
    resolve: {
      alias: {
        '@config': path.resolve('./node_modules/astro-paper/src/config.ts'),
        '@styles/base.css': path.resolve('./node_modules/astro-paper/src/styles/base.css')
      }
    }
  }
});
