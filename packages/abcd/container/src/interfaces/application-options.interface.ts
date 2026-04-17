/**
 * ApplicationOptions Interface
 *
 * Configuration options for `Application.create()`.
 *
 * @module interfaces/application-options
 */

/**
 * Options for `Application.create()`.
 *
 * All options are optional — calling `Application.create(AppModule)` with
 * no options works out of the box with sensible defaults.
 *
 * @example
 * ```typescript
 * const app = await Application.create(AppModule, {
 *   debug: true,
 *   globalName: '__MY_APP__',
 *   onReady: (ctx) => console.log('App ready!', ctx),
 * });
 * ```
 */
export interface ApplicationOptions {
  /**
   * Expose the application on `window` for browser console debugging.
   *
   * When `true`, the application instance is assigned to
   * `window[globalName]` after bootstrap completes.
   *
   * Defaults to `true` in development (`NODE_ENV !== 'production'`),
   * `false` in production.
   *
   * @default undefined (auto-detected from environment)
   */
  debug?: boolean;

  /**
   * The global variable name to expose the application on.
   *
   * Only used when `debug` is enabled.
   *
   * @default '__APP__'
   */
  globalName?: string;

  /**
   * Callback fired after the application is fully bootstrapped.
   *
   * All providers are resolved and `onModuleInit()` hooks have
   * completed by the time this callback is invoked. Use for
   * logging, analytics, or additional setup.
   *
   * Can be async — the `create()` method awaits it before returning.
   *
   * @param app - The bootstrapped Application instance
   */
  onReady?: (app: any) => void | Promise<void>;
}
