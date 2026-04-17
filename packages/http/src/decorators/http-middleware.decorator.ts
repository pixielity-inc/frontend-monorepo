/**
 * @HttpMiddleware Decorator
 *
 * Marks a class as an HTTP middleware and stores priority/name metadata
 * via `Reflect.defineMetadata`. The {@link HttpModule} discovers these
 * decorated classes and registers them in the {@link MiddlewareRegistry}
 * sorted by priority.
 *
 * Lower priority values run first in the pipeline.
 *
 * @module @abdokouta/ts-http
 * @category Decorators
 *
 * @example
 * ```typescript
 * import { Injectable } from '@abdokouta/ts-container';
 * import { HttpMiddleware } from '@abdokouta/ts-http';
 * import type { HttpMiddlewareInterface, HttpNextFunction, HttpContext, HttpResponse } from '@abdokouta/ts-http';
 *
 * @HttpMiddleware({ priority: 10, name: 'auth' })
 * @Injectable()
 * class AuthMiddleware implements HttpMiddlewareInterface {
 *   async handle(context: HttpContext, next: HttpNextFunction): Promise<HttpResponse> {
 *     context.request.headers = {
 *       ...context.request.headers,
 *       Authorization: 'Bearer token',
 *     };
 *     return next(context);
 *   }
 * }
 * ```
 */

import 'reflect-metadata';
import { HTTP_MIDDLEWARE_METADATA } from '@/constants';

/**
 * Configuration options for the `@HttpMiddleware()` decorator.
 */
export interface HttpMiddlewareOptions {
  /**
   * Execution priority — lower values run first in the pipeline.
   *
   * @default 50
   */
  priority?: number;

  /**
   * Optional human-readable name for debugging and logging.
   * Defaults to the class name if not provided.
   */
  name?: string;
}

/**
 * Decorator that marks a class as an HTTP middleware.
 *
 * Stores priority and name metadata on the class via `Reflect.defineMetadata`.
 * The HttpModule reads this metadata during initialization to build the
 * middleware pipeline in the correct order.
 *
 * @param options - Optional priority and name configuration.
 * @returns A class decorator.
 */
export function HttpMiddleware(options: HttpMiddlewareOptions = {}): ClassDecorator {
  return (target: Function) => {
    // Store middleware metadata on the class for later discovery.
    Reflect.defineMetadata(
      HTTP_MIDDLEWARE_METADATA,
      {
        priority: options.priority ?? 50,
        name: options.name ?? target.name,
      },
      target
    );
  };
}

/**
 * Retrieve the `@HttpMiddleware()` metadata from a decorated class.
 *
 * @param target - The class to inspect.
 * @returns The middleware options, or `undefined` if the class is not decorated.
 */
export function getHttpMiddlewareMetadata(target: Function): HttpMiddlewareOptions | undefined {
  return Reflect.getMetadata(HTTP_MIDDLEWARE_METADATA, target);
}
