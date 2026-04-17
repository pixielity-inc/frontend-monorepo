/**
 * InstanceLoader — Provider Instantiation & Lifecycle Orchestrator
 *
 * After the scanner has built the module graph, the InstanceLoader:
 * 1. Resolves all providers in all modules (via the Injector)
 * 2. Calls `onModuleInit()` on providers that implement it
 *
 * It also provides `destroy()` for calling `onModuleDestroy()` during shutdown.
 *
 * ## Bootstrap flow:
 *
 * ```
 * InstanceLoader.createInstances()
 *   ├── Phase 1: Resolve all providers (Injector.resolveProviders)
 *   └── Phase 2: Call onModuleInit() lifecycle hooks
 *
 * InstanceLoader.destroy()
 *   └── Call onModuleDestroy() in reverse module order
 * ```
 *
 * @module injector/instance-loader
 */

import { hasOnModuleInit } from '@/interfaces/on-module-init.interface';
import { hasOnModuleDestroy } from '@/interfaces/on-module-destroy.interface';
import { NestContainer } from './container';
import { Injector } from './injector';
import { Module } from './module';

/**
 * Loads (instantiates) all providers and runs lifecycle hooks.
 *
 * Created with a reference to the `NestContainer` and internally creates
 * an `Injector` for dependency resolution. Orchestrates the two-phase
 * bootstrap (resolve → init hooks) and the shutdown sequence.
 *
 * @example
 * ```typescript
 * const container = new NestContainer();
 * const scanner = new DependenciesScanner(container);
 * await scanner.scan(AppModule);
 *
 * const loader = new InstanceLoader(container);
 * await loader.createInstances();
 *
 * // During shutdown:
 * await loader.destroy();
 * ```
 */
export class InstanceLoader {
  /**
   * The injector used for resolving provider dependencies.
   * Created once in the constructor and reused for all modules.
   */
  private readonly injector: Injector;

  /**
   * Create a new InstanceLoader.
   *
   * @param container - The `NestContainer` holding all registered modules
   *   and their provider bindings
   */
  constructor(private readonly container: NestContainer) {
    this.injector = new Injector();
  }

  /**
   * Instantiate all providers in all modules.
   *
   * Runs in two phases:
   * 1. **Resolution** — Iterates all modules and resolves each module's
   *    providers via the injector. Dependencies are resolved recursively.
   * 2. **Lifecycle hooks** — Calls `onModuleInit()` on all providers that
   *    implement the `OnModuleInit` interface.
   *
   * @returns A Promise that resolves when all providers are instantiated
   *   and all `onModuleInit()` hooks have completed
   *
   * @example
   * ```typescript
   * const loader = new InstanceLoader(container);
   * await loader.createInstances();
   * // All providers are now ready to use
   * ```
   */
  public async createInstances(): Promise<void> {
    const modules = this.container.getModules();

    // Phase 1: Resolve all providers
    for (const [, moduleRef] of modules) {
      await this.injector.resolveProviders(moduleRef);
    }

    // Phase 2: Call onModuleInit() lifecycle hooks
    for (const [, moduleRef] of modules) {
      await this.callModuleInitHooks(moduleRef);
    }
  }

  /**
   * Call `onModuleDestroy()` on all providers that implement it.
   *
   * Called during application shutdown. Iterates modules in reverse
   * order (leaf modules first, root module last) to ensure dependencies
   * are still available when a provider's destroy hook runs.
   *
   * @returns A Promise that resolves when all destroy hooks have completed
   *
   * @example
   * ```typescript
   * // During application shutdown:
   * await loader.destroy();
   * ```
   */
  public async destroy(): Promise<void> {
    const modules = [...this.container.getModules().values()].reverse();

    for (const moduleRef of modules) {
      await this.callModuleDestroyHooks(moduleRef);
    }
  }

  /**
   * Get the injector instance.
   *
   * Provides access to the internal injector for direct resolution
   * outside the normal module system (e.g., in the `ApplicationContext`).
   *
   * @returns The `Injector` instance used by this loader
   *
   * @example
   * ```typescript
   * const injector = loader.getInjector();
   * const result = injector.lookupProvider(UserService, moduleRef);
   * ```
   */
  public getInjector(): Injector {
    return this.injector;
  }

  // ── Private: Lifecycle hooks ─────────────────────────────────────────────

  /**
   * Call `onModuleInit()` on all resolved providers in a module.
   *
   * Iterates the module's providers and calls `onModuleInit()` on each
   * resolved instance that implements the `OnModuleInit` interface.
   * Async hooks are awaited before proceeding to the next provider.
   *
   * @param moduleRef - The module whose providers to initialize
   */
  private async callModuleInitHooks(moduleRef: Module): Promise<void> {
    for (const [, wrapper] of moduleRef.providers) {
      if (wrapper.isResolved && wrapper.instance && hasOnModuleInit(wrapper.instance)) {
        await wrapper.instance.onModuleInit();
      }
    }
  }

  /**
   * Call `onModuleDestroy()` on all resolved providers in a module.
   *
   * Iterates the module's providers and calls `onModuleDestroy()` on each
   * resolved instance that implements the `OnModuleDestroy` interface.
   * Async hooks are awaited before proceeding to the next provider.
   *
   * @param moduleRef - The module whose providers to destroy
   */
  private async callModuleDestroyHooks(moduleRef: Module): Promise<void> {
    for (const [, wrapper] of moduleRef.providers) {
      if (wrapper.isResolved && wrapper.instance && hasOnModuleDestroy(wrapper.instance)) {
        await wrapper.instance.onModuleDestroy();
      }
    }
  }
}
