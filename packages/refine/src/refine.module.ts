/**
 * @fileoverview RefineModule — DI module with forRoot and forFeature patterns.
 *
 * `forRoot()` configures global services (auth, ACL, realtime, notification,
 * audit log), the TanStack QueryClient, ServiceRegistry, and QueryStringSerializer.
 *
 * `forFeature()` accepts Model classes decorated with `@Resource`, reads their
 * metadata, auto-creates Repository + Service pairs, and registers them in
 * the ServiceRegistry.
 *
 * @module @abdokouta/react-refine
 * @category Module
 *
 * @example
 * ```typescript
 * // Root configuration
 * @Module({
 *   imports: [
 *     RefineModule.forRoot({
 *       authService: MyAuthService,
 *       queryStringSerializer: new JsonApiQueryStringSerializer(),
 *     }),
 *   ],
 * })
 * export class AppModule {}
 *
 * // Feature registration
 * @Module({
 *   imports: [RefineModule.forFeature([Post, User])],
 * })
 * export class BlogModule {}
 * ```
 */

import { getResourceMetadata } from './decorators/resource.decorator';
import { getModelMetadata } from './decorators/model.decorator';
import { ServiceRegistry } from './registries/service.registry';
import { DefaultService } from './services/default.service';
import { HttpRepository } from './repositories/http.repository';
import { EloquentRepository } from './repositories/eloquent.repository';
import { LaravelQueryStringSerializer } from './serializers/laravel.serializer';
import type { RefineRootOptions } from './types/refine-root-options.type';
import type { Type } from './types/type-constructor.type';
import {
  SERVICE_REGISTRY,
  QUERY_CLIENT,
  REFINE_OPTIONS,
  AUTH_SERVICE,
  ACCESS_CONTROL_SERVICE,
  REALTIME_SERVICE,
  NOTIFICATION_SERVICE,
  AUDIT_LOG_SERVICE,
  HTTP_CLIENT,
  QUERY_STRING_SERIALIZER,
} from './constants';

/**
 * Core DI module for the refine service layer.
 *
 * Provides `forRoot()` for global configuration and
 * `forFeature()` for per-module resource registration.
 */
export class RefineModule {
  /** Singleton ServiceRegistry instance shared across all forFeature calls. */
  private static serviceRegistry = new ServiceRegistry();

  /** Global QueryStringSerializer (defaults to Laravel). */
  private static serializer = new LaravelQueryStringSerializer();

  /** Global HTTP client reference. */
  private static httpClient: any = typeof fetch !== 'undefined' ? fetch : undefined;

  /**
   * Configure global services and the TanStack QueryClient.
   *
   * @param options - Root configuration options.
   * @returns A DynamicModule-compatible configuration object.
   */
  static forRoot(options: RefineRootOptions = {}) {
    // Store serializer globally
    if (options.queryStringSerializer) {
      RefineModule.serializer = options.queryStringSerializer as any;
    }

    const providers: any[] = [
      { provide: SERVICE_REGISTRY, useValue: RefineModule.serviceRegistry },
      { provide: REFINE_OPTIONS, useValue: options },
      { provide: QUERY_STRING_SERIALIZER, useValue: RefineModule.serializer },
      { provide: ServiceRegistry, useValue: RefineModule.serviceRegistry },
    ];

    // QueryClient
    if (options.queryClient) {
      providers.push({ provide: QUERY_CLIENT, useValue: options.queryClient });
    }

    // HTTP client (fetch by default)
    providers.push({ provide: HTTP_CLIENT, useValue: RefineModule.httpClient });

    // Provider services — register if provided
    if (options.authService) {
      providers.push({ provide: AUTH_SERVICE, useValue: options.authService });
    }
    if (options.accessControlService) {
      providers.push({ provide: ACCESS_CONTROL_SERVICE, useValue: options.accessControlService });
    }
    if (options.realtimeService) {
      providers.push({ provide: REALTIME_SERVICE, useValue: options.realtimeService });
    }
    if (options.notificationService) {
      providers.push({ provide: NOTIFICATION_SERVICE, useValue: options.notificationService });
    }
    if (options.auditLogService) {
      providers.push({ provide: AUDIT_LOG_SERVICE, useValue: options.auditLogService });
    }

    return {
      module: RefineModule,
      global: options.isGlobal ?? true,
      providers,
      exports: [SERVICE_REGISTRY, QUERY_CLIENT, REFINE_OPTIONS, ServiceRegistry],
    };
  }

  /**
   * Register resource services from Model classes decorated with `@Resource`.
   *
   * Reads `@Resource` metadata from each Model class:
   * - If no custom repository: auto-creates HttpRepository (or EloquentRepository if `@Model` present)
   * - If no custom service: auto-creates DefaultService bound to the repository
   * - Registers the service in ServiceRegistry under the resource name
   *
   * @param models - Array of Model classes decorated with `@Resource`.
   * @returns A DynamicModule-compatible configuration object.
   * @throws {Error} If a class is missing the `@Resource` decorator.
   */
  static forFeature(models: Type<any>[]) {
    const registry = RefineModule.serviceRegistry;

    for (const modelClass of models) {
      const resourceMeta = getResourceMetadata(modelClass);
      if (!resourceMeta) {
        throw new Error(
          `Class "${modelClass.name}" is missing the @Resource decorator. ` +
            `Add @Resource({ name: ..., endpoint: ... }) to the class.`
        );
      }

      const modelMeta = getModelMetadata(modelClass);

      // 1. Create or use custom repository
      let repository: any;
      if (resourceMeta.repository) {
        // Custom repository specified in @Resource metadata
        repository = new resourceMeta.repository();
      } else if (modelMeta) {
        // @Model present → EloquentRepository for local-first data
        repository = new EloquentRepository(modelClass);
      } else {
        // Default → HttpRepository for remote-first data
        repository = new HttpRepository(
          RefineModule.httpClient,
          { endpoint: resourceMeta.endpoint },
          RefineModule.serializer
        );
      }

      // 2. Create or use custom service
      let service: any;
      if (resourceMeta.service) {
        // Custom service specified in @Resource metadata
        service = new resourceMeta.service(repository);
      } else {
        // Default → DefaultService (pure delegation)
        service = new DefaultService(repository);
      }

      // 3. Register in ServiceRegistry under the resource name
      registry.register(resourceMeta.name, service);
    }

    return {
      module: RefineModule,
      providers: [],
    };
  }

  /**
   * Get the global ServiceRegistry instance.
   * Used internally by hooks to resolve services.
   *
   * @returns The singleton ServiceRegistry.
   */
  static getServiceRegistry(): ServiceRegistry {
    return RefineModule.serviceRegistry;
  }

  /**
   * Get the global QueryStringSerializer.
   * @returns The configured serializer.
   */
  static getSerializer(): any {
    return RefineModule.serializer;
  }
}
