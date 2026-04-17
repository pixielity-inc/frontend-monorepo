/**
 * ContainerProviderProps Interface
 *
 * Props for the `<ContainerProvider>` component.
 *
 * @module react/interfaces/container-provider-props
 */

import type React from 'react';
import type { ContainerResolver } from '@/interfaces';

/**
 * Props for the `<ContainerProvider>` component.
 *
 * @example
 * ```tsx
 * <ContainerProvider context={app}>
 *   <App />
 * </ContainerProvider>
 * ```
 */
export interface ContainerProviderProps {
  /**
   * The container resolver (typically an `Application` instance).
   * Must implement `get()`, `getOptional()`, and `has()`.
   */
  context: ContainerResolver;

  /**
   * Child components that will have access to the container.
   */
  children: React.ReactNode;
}
