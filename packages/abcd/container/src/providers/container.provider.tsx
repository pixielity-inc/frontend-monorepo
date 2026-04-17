/**
 * ContainerProvider Component
 *
 * Wrap your application (or a subtree) with `<ContainerProvider>` to make
 * the DI container available to all child components via `useInject()`.
 *
 * @module react/providers/container
 */

import { ContainerContext } from '../contexts/container.context';
import type { ContainerProviderProps } from '../interfaces/container-provider-props.interface';

/**
 * Provides the DI container to the React component tree.
 *
 * Accepts a `ContainerResolver` (typically an `Application` instance)
 * and makes it available to all descendant components via React context.
 *
 * @param props - The provider props containing the context and children
 * @returns A React element wrapping children with the container context
 *
 * @example
 * ```tsx
 * import { Application } from '@abdokouta/ts-container';
 * import { ContainerProvider } from '@abdokouta/ts-container/react';
 * import { AppModule } from './app.module';
 *
 * const app = await Application.create(AppModule);
 *
 * ReactDOM.createRoot(document.getElementById('root')!).render(
 *   <ContainerProvider context={app}>
 *     <App />
 *   </ContainerProvider>
 * );
 * ```
 */
export function ContainerProvider({ context, children }: ContainerProviderProps) {
  return <ContainerContext.Provider value={context}>{children}</ContainerContext.Provider>;
}
