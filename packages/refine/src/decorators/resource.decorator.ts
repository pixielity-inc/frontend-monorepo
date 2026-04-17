/**
 * @fileoverview `@Resource` class decorator for storing resource metadata.
 *
 * The decorator stores metadata on the Model class via `Reflect.defineMetadata`.
 * It does NOT register anything in the DI container or ServiceRegistry —
 * that happens later in `forFeature()`.
 *
 * @module @abdokouta/react-refine
 * @category Decorators
 *
 * @example
 * ```typescript
 * import { Resource } from '@abdokouta/react-refine';
 * import { POST_RESOURCE } from '@/tokens/post.token';
 *
 * @Resource({ name: POST_RESOURCE, endpoint: '/api/posts' })
 * export class Post {
 *   id!: string;
 *   title!: string;
 * }
 * ```
 */

import 'reflect-metadata';
import { RESOURCE_METADATA_KEY } from '@/constants';
import type { ResourceMetadata } from '@/interfaces/resource-metadata.interface';

/**
 * Class decorator that stores resource metadata on a Model class.
 *
 * The metadata is later read by `RefineModule.forFeature()` to
 * auto-create Repository + Service pairs and register them
 * in the ServiceRegistry.
 *
 * @param metadata - Resource configuration (name, endpoint, optional service/repository).
 * @returns A class decorator function.
 */
export function Resource(metadata: ResourceMetadata): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata(RESOURCE_METADATA_KEY, metadata, target);
  };
}

/**
 * Read `@Resource` metadata from a decorated class.
 *
 * @param target - The class to read metadata from.
 * @returns The stored {@link ResourceMetadata}, or `undefined` if not decorated.
 */
export function getResourceMetadata(target: Function): ResourceMetadata | undefined {
  return Reflect.getMetadata(RESOURCE_METADATA_KEY, target);
}
