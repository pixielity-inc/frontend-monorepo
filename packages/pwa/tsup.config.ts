import { defineConfig } from 'tsup';

/**
 * tsup Build Configuration
 *
 * |--------------------------------------------------------------------------
 * | @abdokouta/ts-pwa
 * |--------------------------------------------------------------------------
 * |
 * | PWA toolkit — React components, hooks, and a Vite plugin wrapper.
 * |
 * | Build output:
 * |   dist/index.mjs        — ESM (tree-shakeable, modern bundlers)
 * |   dist/index.js         — CJS (Node.js, legacy bundlers)
 * |   dist/index.d.ts       — TypeScript declarations
 * |   dist/vite-plugin.mjs  — ESM Vite plugin entry
 * |   dist/vite-plugin.js   — CJS Vite plugin entry
 * |   dist/vite-plugin.d.ts — Vite plugin declarations
 * |
 * @see https://tsup.egoist.dev/
 */
export default defineConfig({
  /*
  |--------------------------------------------------------------------------
  | Entry Points
  |--------------------------------------------------------------------------
  |
  | Two entry points:
  |   - src/index.ts       — React components, hooks, providers, interfaces
  |   - src/vite-plugin.ts — Vite plugin wrapper around vite-plugin-pwa
  |
  */
  entry: ['src/index.ts', 'src/plugins/vite.plugin.ts'],

  /*
  |--------------------------------------------------------------------------
  | Output Formats
  |--------------------------------------------------------------------------
  |
  | Dual format output for maximum compatibility:
  |   - ESM (.mjs): Modern module format, enables tree-shaking
  |   - CJS (.js):  CommonJS for Node.js and legacy bundlers
  |
  */
  format: ['esm', 'cjs'],

  /*
  |--------------------------------------------------------------------------
  | TypeScript Declarations
  |--------------------------------------------------------------------------
  |
  | Generate .d.ts and .d.cts declaration files for full type safety.
  |
  */
  dts: true,

  /*
  |--------------------------------------------------------------------------
  | Source Maps
  |--------------------------------------------------------------------------
  */
  sourcemap: true,

  /*
  |--------------------------------------------------------------------------
  | Clean Output
  |--------------------------------------------------------------------------
  */
  clean: true,

  /*
  |--------------------------------------------------------------------------
  | Minification
  |--------------------------------------------------------------------------
  |
  | Disabled — consumers minify during their own build.
  |
  */
  minify: false,

  /*
  |--------------------------------------------------------------------------
  | Target
  |--------------------------------------------------------------------------
  */
  target: 'es2020',

  /*
  |--------------------------------------------------------------------------
  | Platform
  |--------------------------------------------------------------------------
  |
  | Platform-neutral — the main entry runs in the browser (React),
  | the vite-plugin entry runs in Node.js (Vite build pipeline).
  |
  */
  platform: 'neutral',

  /*
  |--------------------------------------------------------------------------
  | External Dependencies
  |--------------------------------------------------------------------------
  |
  | Dependencies that should NOT be bundled into the output.
  |
  */
  external: [
    'react',
    'react-dom',
    'vite',
    'vite-plugin-pwa',
    'workbox-build',
    'workbox-window',
    '@heroui/react',
    'lucide-react',
  ],

  /*
  |--------------------------------------------------------------------------
  | Code Splitting
  |--------------------------------------------------------------------------
  */
  splitting: false,

  /*
  |--------------------------------------------------------------------------
  | Skip node_modules
  |--------------------------------------------------------------------------
  */
  skipNodeModulesBundle: true,

  /*
  |--------------------------------------------------------------------------
  | esbuild Options
  |--------------------------------------------------------------------------
  */
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },

  /*
  |--------------------------------------------------------------------------
  | Output Extensions
  |--------------------------------------------------------------------------
  */
  outExtension({ format }) {
    return { js: format === 'esm' ? '.mjs' : '.js' };
  },
});
