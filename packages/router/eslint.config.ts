/**
 * @fileoverview ESLint configuration for @abdokouta/react-router package.
 * @module @abdokouta/react-router
 * @category Configuration
 */
import type { Linter } from 'eslint';
import { viteConfig } from '@nesvel/eslint-config';

const config: Linter.Config[] = [
  ...viteConfig,
  { ignores: ['dist/**', 'node_modules/**', '*.config.js', '*.config.ts'] },
  { rules: {} },
];
export default config;
