/**
 * @fileoverview Root barrel export for `@abdokouta/react-refine`.
 *
 * This is the single entry point for the core refine package.
 * Route and SDUI exports live in their own packages.
 *
 * @module @abdokouta/react-refine
 * @category Entry
 */

// ─── Constants ───────────────────────────────────────────────────────
export * from './constants';

// ─── Enums ───────────────────────────────────────────────────────────
export * from './enums';

// ─── Interfaces ──────────────────────────────────────────────────────
export * from './interfaces';

// ─── Types ───────────────────────────────────────────────────────────
export * from './types';

// ─── Decorators ──────────────────────────────────────────────────────
export * from './decorators';

// ─── Repositories ────────────────────────────────────────────────────
export * from './repositories';

// ─── Services ────────────────────────────────────────────────────────
export * from './services';

// ─── Registries ──────────────────────────────────────────────────────
export * from './registries';

// ─── Tokens ──────────────────────────────────────────────────────────
export * from './tokens';

// ─── Utils ───────────────────────────────────────────────────────────
export * from './utils';

// ─── Serializers ─────────────────────────────────────────────────────
export * from './serializers';

// ─── Hooks ───────────────────────────────────────────────────────────
export * from './hooks';

// ─── Module ──────────────────────────────────────────────────────────
export { RefineModule } from './refine.module';
