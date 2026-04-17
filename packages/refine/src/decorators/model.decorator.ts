/**
 * @fileoverview `@Model` class decorator for marking RxDB/Eloquent models.
 *
 * The decorator stores metadata on the class via `Reflect.defineMetadata`.
 * When `forFeature` detects `@Model` metadata, it auto-creates an
 * `EloquentRepository` instead of `HttpRepository`.
 *
 * @module @abdokouta/react-refine
 * @category Decorators
 *
 * @example
 * ```typescript
 * import { Resource, Model } from '@abdokouta/react-refine';
 * import { NOTE_RESOURCE } from '@/tokens/note.token';
 *
 * @Resource({ name: NOTE_RESOURCE, endpoint: '/api/notes' })
 * @Model({ collection: 'notes', version: 1 })
 * export class Note {
 *   id!: string;
 *   content!: string;
 * }
 * ```
 */

import 'reflect-metadata';
import { MODEL_METADATA_KEY } from '@/constants';
import type { ModelMetadata } from '@/interfaces/model-metadata.interface';

/**
 * Class decorator that marks a class as an RxDB/Eloquent database model.
 *
 * Independent of `@Resource` — a class can have `@Resource` only,
 * `@Model` only, or both.
 *
 * @param metadata - Optional model configuration (collection name, version).
 * @returns A class decorator function.
 */
export function Model(metadata: ModelMetadata = {}): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata(MODEL_METADATA_KEY, metadata, target);
  };
}

/**
 * Read `@Model` metadata from a decorated class.
 *
 * @param target - The class to read metadata from.
 * @returns The stored {@link ModelMetadata}, or `undefined` if not decorated.
 */
export function getModelMetadata(target: Function): ModelMetadata | undefined {
  return Reflect.getMetadata(MODEL_METADATA_KEY, target);
}
