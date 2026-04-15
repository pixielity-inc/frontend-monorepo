/**
 * @fileoverview VitePwaPluginOptions — configuration for the PWA Vite plugin wrapper.
 *
 * Extends vite-plugin-pwa options with sensible defaults and
 * additional convenience options for the @abdokouta/ts-pwa package.
 *
 * @module pwa/plugins/interfaces/vite-pwa-plugin-options
 */

/**
 * Manifest icon definition.
 */
export interface ManifestIcon {
  src: string;
  sizes: string;
  type: string;
  purpose?: 'any' | 'maskable' | 'monochrome' | string;
}

/**
 * Web App Manifest configuration.
 *
 * Subset of the W3C Web App Manifest spec with the most commonly used fields.
 */
export interface ManifestOptions {
  /** Application name. */
  name?: string;

  /** Short name for the home screen icon. */
  short_name?: string;

  /** Application description. */
  description?: string;

  /** Theme color for the browser chrome. */
  theme_color?: string;

  /** Background color for the splash screen. */
  background_color?: string;

  /** Display mode. @default "standalone" */
  display?: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';

  /** Preferred orientation. */
  orientation?: 'any' | 'natural' | 'landscape' | 'portrait';

  /** Start URL when the app is launched. @default "/" */
  start_url?: string;

  /** Scope of the PWA navigation. @default "/" */
  scope?: string;

  /** Application icons. */
  icons?: ManifestIcon[];

  /** Additional manifest properties. */
  [key: string]: unknown;
}

/**
 * Workbox runtime caching strategy configuration.
 */
export interface RuntimeCachingEntry {
  /** URL pattern to match (string or RegExp). */
  urlPattern: string | RegExp;

  /** Caching strategy handler. */
  handler: 'CacheFirst' | 'NetworkFirst' | 'NetworkOnly' | 'StaleWhileRevalidate' | 'CacheOnly';

  /** Strategy options. */
  options?: {
    cacheName?: string;
    expiration?: {
      maxEntries?: number;
      maxAgeSeconds?: number;
    };
    cacheableResponse?: {
      statuses?: number[];
    };
    networkTimeoutSeconds?: number;
    [key: string]: unknown;
  };

  /** HTTP method to match. @default "GET" */
  method?: string;
}

/**
 * Configuration options for the PWA Vite plugin wrapper.
 *
 * Wraps `vite-plugin-pwa` with sensible defaults for production PWAs.
 * All options are optional — the plugin works out of the box.
 *
 * @example
 * ```ts
 * import { vitePwaPlugin } from '@abdokouta/ts-pwa/vite-plugin'
 *
 * export default defineConfig({
 *   plugins: [
 *     vitePwaPlugin({
 *       manifest: {
 *         name: 'My App',
 *         short_name: 'App',
 *         theme_color: '#ffffff',
 *       },
 *     }),
 *   ],
 * })
 * ```
 */
export interface VitePwaPluginOptions {
  /**
   * Service worker registration type.
   *
   * - `"autoUpdate"` — auto-updates the service worker in the background (recommended)
   * - `"prompt"` — shows a prompt to the user when an update is available
   *
   * @default "autoUpdate"
   */
  registerType?: 'autoUpdate' | 'prompt';

  /**
   * Whether to include the PWA assets (manifest, icons) in the build.
   * @default true
   */
  includeAssets?: string[];

  /**
   * Web App Manifest configuration.
   * Merged with sensible defaults (standalone display, start_url "/", etc.).
   */
  manifest?: ManifestOptions | false;

  /**
   * Workbox configuration for the service worker.
   */
  workbox?: {
    /** Glob patterns for files to precache. */
    globPatterns?: string[];

    /** Runtime caching strategies. */
    runtimeCaching?: RuntimeCachingEntry[];

    /** Whether to clean outdated caches on activate. @default true */
    cleanupOutdatedCaches?: boolean;

    /** Navigation fallback for SPA routing. @default "index.html" */
    navigateFallback?: string;

    /** Additional workbox options. */
    [key: string]: unknown;
  };

  /**
   * Development options.
   */
  devOptions?: {
    /** Enable PWA in development mode. @default false */
    enabled?: boolean;

    /** Service worker type. @default "module" */
    type?: 'classic' | 'module';

    /** Additional dev options. */
    [key: string]: unknown;
  };

  /**
   * Strategy for generating the service worker.
   *
   * - `"generateSW"` — Workbox generates the SW automatically (recommended)
   * - `"injectManifest"` — inject precache manifest into a custom SW file
   *
   * @default "generateSW"
   */
  strategies?: 'generateSW' | 'injectManifest';

  /**
   * Path to the custom service worker source file.
   * Only used when `strategies` is `"injectManifest"`.
   *
   * @default "src/sw.ts"
   */
  srcDir?: string;

  /**
   * Filename for the custom service worker.
   * Only used when `strategies` is `"injectManifest"`.
   *
   * @default "sw.ts"
   */
  filename?: string;

  /**
   * Whether to disable the plugin entirely.
   * Useful for conditional enabling based on environment.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Pass-through options for vite-plugin-pwa.
   * These are merged last and override any computed defaults.
   */
  overrides?: Record<string, unknown>;
}
