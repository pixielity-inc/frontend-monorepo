/**
 * @Inject() Decorator
 *
 * Explicitly specifies the injection token for a constructor parameter
 * or class property. This is needed when:
 *
 * 1. The token is a string or symbol (not a class)
 * 2. You want to inject a different implementation than the parameter type
 * 3. The parameter type is an interface (interfaces are erased at runtime)
 *
 * ## How it works:
 *
 * **Constructor parameter injection:**
 * Pushes `{ index, param: token }` into the `self:paramtypes` metadata array.
 * During resolution, the injector merges `self:paramtypes` with `design:paramtypes`
 * — explicit `@Inject()` tokens override the auto-detected types.
 *
 * **Property injection:**
 * Pushes `{ key, type: token }` into the `self:properties_metadata` array.
 * After construction, the injector resolves each property dependency and
 * assigns it to the instance.
 *
 * @module decorators/inject
 */

import 'reflect-metadata';
import {
  PARAMTYPES_METADATA,
  PROPERTY_DEPS_METADATA,
  SELF_DECLARED_DEPS_METADATA,
} from '@/constants';
import type { InjectionToken, ForwardReference } from '@/interfaces';

/**
 * Specifies the injection token for a constructor parameter or class property.
 *
 * When used on a constructor parameter, the token is stored in `self:paramtypes`
 * metadata and overrides the auto-detected type from `design:paramtypes`.
 * When used on a class property, the token is stored in `self:properties_metadata`
 * and the injector assigns the resolved value after construction.
 *
 * If no token is provided, the decorator infers the token from TypeScript's
 * emitted type metadata (`design:type` for properties, `design:paramtypes`
 * for constructor parameters).
 *
 * @param token - The injection token to use for resolution. Can be a class,
 *   string, symbol, or forward reference. If omitted, falls back to the
 *   TypeScript-emitted type metadata.
 * @returns A combined `PropertyDecorator & ParameterDecorator` that stores
 *   the injection metadata on the target class
 *
 * @example
 * ```typescript
 * // Constructor parameter injection with a symbol token
 * @Injectable()
 * class CacheService {
 *   constructor(
 *     @Inject(CACHE_CONFIG) private config: CacheModuleOptions,
 *     @Inject(RedisManager) private redis: RedisManager,
 *   ) {}
 * }
 *
 * // Property injection
 * @Injectable()
 * class UserService {
 *   @Inject(LoggerService)
 *   private logger!: LoggerService;
 * }
 *
 * // Without explicit token — uses the TypeScript type
 * @Injectable()
 * class OrderService {
 *   constructor(private userService: UserService) {}
 *   // Equivalent to: @Inject(UserService) private userService: UserService
 * }
 * ```
 */
export function Inject(
  token?: InjectionToken | ForwardReference
): PropertyDecorator & ParameterDecorator {
  const hasExplicitToken = arguments.length > 0;

  return (target: object, key: string | symbol | undefined, index?: number) => {
    // Resolve the token: explicit > design:type > design:paramtypes[index]
    let resolvedToken = token;

    if (!resolvedToken && !hasExplicitToken) {
      // Try to infer from TypeScript metadata
      if (key !== undefined) {
        // Property injection — use design:type
        resolvedToken = Reflect.getMetadata('design:type', target, key);
      } else if (index !== undefined) {
        // Constructor injection — use design:paramtypes[index]
        const paramTypes = Reflect.getMetadata(PARAMTYPES_METADATA, target) || [];
        resolvedToken = paramTypes[index];
      }
    }

    // Handle forward references — unwrap the lazy function immediately
    if (resolvedToken && typeof resolvedToken === 'object' && 'forwardRef' in resolvedToken) {
      resolvedToken = (resolvedToken as ForwardReference).forwardRef();
    }

    if (index !== undefined) {
      // ── Constructor parameter injection ──────────────────────────────
      // Store in self:paramtypes — these override design:paramtypes
      const existingDeps = Reflect.getMetadata(SELF_DECLARED_DEPS_METADATA, target) || [];

      Reflect.defineMetadata(
        SELF_DECLARED_DEPS_METADATA,
        [...existingDeps, { index, param: resolvedToken }],
        target
      );
    } else {
      // ── Property injection ───────────────────────────────────────────
      // Store in self:properties_metadata
      const existingProps = Reflect.getMetadata(PROPERTY_DEPS_METADATA, target.constructor) || [];

      Reflect.defineMetadata(
        PROPERTY_DEPS_METADATA,
        [...existingProps, { key, type: resolvedToken }],
        target.constructor
      );
    }
  };
}
