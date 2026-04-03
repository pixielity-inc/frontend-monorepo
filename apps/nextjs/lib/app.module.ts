/**
 * @file app.module.ts
 * @description Root DI module for the Next.js application.
 *
 * Wires together the three core packages:
 *   - @abdokouta/react-config  — environment-aware configuration
 *   - @abdokouta/react-logger  — structured logging with channels
 *   - @abdokouta/react-di      — NestJS-style dependency injection
 *
 * This module is bootstrapped once in the ContainerProvider and made
 * available to all React components via the useInject() hook.
 */

import "reflect-metadata";

import { Module } from "@abdokouta/react-di";
import { ConfigModule } from "@abdokouta/react-config";
import { LoggerModule } from "@abdokouta/react-logger";

/**
 * AppModule — root module of the application.
 *
 * Imports:
 *   - ConfigModule.forRoot()  — loads env vars, exposes ConfigService globally
 *   - LoggerModule.forRoot()  — configures logging channels, exposes LoggerService
 */
@Module({
  imports: [
    /**
     * ConfigModule — environment-aware configuration.
     *
     * Uses the EnvDriver by default which reads from process.env /
     * import.meta.env (Vite) or Next.js runtime env.
     *
     * isGlobal: true — ConfigService is available in every module
     * without re-importing ConfigModule.
     */
    ConfigModule.forRoot({
      driver: "env",
      isGlobal: true,
    }),

    /**
     * LoggerModule — structured logging with pluggable transporters.
     *
     * Channels:
     *   app     — pretty-printed console output (development)
     *   json    — JSON-formatted output (production / log aggregators)
     *   silent  — discards all output (testing)
     *
     * The active channel is selected by the LOG_CHANNEL env var,
     * defaulting to "app".
     */
    LoggerModule.forRoot({
      default: "app",
      channels: {
        app: {
          level: "debug",
          transporters: [
            {
              type: "console",
              format: "pretty",
            },
          ],
        },
        json: {
          level: "info",
          transporters: [
            {
              type: "console",
              format: "json",
            },
          ],
        },
        silent: {
          level: "debug",
          transporters: [{ type: "silent" }],
        },
      },
    }),
  ],
  providers: [],
  exports: [],
})
export class AppModule {}
