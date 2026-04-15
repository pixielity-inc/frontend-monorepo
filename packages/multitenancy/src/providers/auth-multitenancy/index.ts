/**
 * Providers
 */

export {
  withMultitenancy,
  createTenantSwitcher,
  createTenantContext,
} from './auth-multitenancy.provider';

export type { MultitenancyConfig } from './auth-multitenancy.provider';
