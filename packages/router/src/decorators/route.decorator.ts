/**
 * @fileoverview `@Route` class decorator for route auto-registration.
 *
 * @module @abdokouta/react-router
 * @category Decorators
 *
 * @example
 * ```typescript
 * import { Route } from '@abdokouta/react-router';
 *
 * @Route({ path: '/posts', resource: 'posts', action: 'list' })
 * export class PostListPage { ... }
 * ```
 */

import 'reflect-metadata';
import { ROUTE_METADATA_KEY } from '@/constants';
import type { RouteMetadata } from '@/interfaces/route-metadata.interface';

/**
 * Class decorator that stores route metadata on a component class.
 *
 * @param metadata - Route configuration.
 * @returns A class decorator function.
 */
export function Route(metadata: RouteMetadata): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata(ROUTE_METADATA_KEY, metadata, target);
  };
}

/**
 * Read `@Route` metadata from a decorated class.
 *
 * @param target - The class to read metadata from.
 * @returns The stored {@link RouteMetadata}, or `undefined` if not decorated.
 */
export function getRouteMetadata(target: Function): RouteMetadata | undefined {
  return Reflect.getMetadata(ROUTE_METADATA_KEY, target);
}
