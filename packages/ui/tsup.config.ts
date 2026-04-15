/**
 * @fileoverview tsup build configuration for @abdokouta/ts-ui package
 *
 * Extends the @nesvel/tsup-config base preset with:
 * - Custom entry points (index.ts + styles.css)
 * - esbuild alias for @/ path resolution
 * - Additional externals for React, HeroUI, Framer Motion
 *
 * @module @abdokouta/ts-ui
 * @category Configuration
 * @see https://tsup.egoist.dev/
 */

import path from "path";
import {
  basePreset,
  computeExternals,
  loadPackageJson,
} from "@nesvel/tsup-config";

// Load package.json to compute externals
const pkg = loadPackageJson();

export default {
  ...basePreset,

  // Multiple entry points — main index + CSS styles
  entry: ["src/index.ts", "src/styles.css"],

  // Recompute externals + add UI-specific externals
  external: [
    ...computeExternals(pkg),
    "react",
    "react-dom",
    "@heroui/react",
    "@heroui/theme",
    "framer-motion",
    "tailwindcss",
  ],

  // CSS loader — copy CSS files to dist
  loader: {
    ".css": "copy" as const,
  },

  // esbuild options — resolve @/ path alias
  esbuildOptions(options: any) {
    options.jsx = "automatic";
    options.alias = {
      "@": path.resolve(process.cwd(), "src"),
    };
  },
};
