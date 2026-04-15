/**
 * @fileoverview tsup build configuration for @abdokouta/kbd package
 *
 * This configuration extends the @nesvel/tsup-config base preset
 * with a custom entry point (index.tsx instead of index.ts).
 *
 * @module @abdokouta/kbd
 * @category Configuration
 * @see https://tsup.egoist.dev/
 */

// Import the base preset and the package.json loader utility
import {
  basePreset,
  computeExternals,
  loadPackageJson,
} from "@nesvel/tsup-config";

// Load package.json to compute externals
const pkg = loadPackageJson();

export default {
  ...basePreset,
  // Override entry point — kbd uses .tsx for JSX components
  entry: ["src/index.tsx"],
  // Recompute externals from package.json
  external: computeExternals(pkg),
};
