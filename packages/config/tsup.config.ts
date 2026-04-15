/**
 * @fileoverview tsup build configuration for @abdokouta/ts-config package
 *
 * Extends the @nesvel/tsup-config base preset with multiple entry points:
 * - src/index.ts — main package entry (ConfigModule, ConfigService, etc.)
 * - src/vite-plugin.ts — Vite plugin for injecting env vars at build time
 *
 * @module @abdokouta/ts-config
 * @category Configuration
 * @see https://tsup.egoist.dev/
 */

import { basePreset, computeExternals, loadPackageJson } from '@nesvel/tsup-config';

// Load package.json to compute externals
const pkg = loadPackageJson();

export default {
  ...basePreset,

  // Multiple entry points — main index + Vite plugin
  entry: ['src/index.ts', 'src/vite-plugin.ts'],

  // Recompute externals from package.json
  external: computeExternals(pkg),
};
