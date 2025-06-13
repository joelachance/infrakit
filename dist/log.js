"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = require("effect");
// Save original console methods
// const originalConsoleLog = globalThis.console.log;
// const logger = Logger.make(({ logLevel, message }) => {
//     originalConsoleLog(`[${logLevel.label}] ${message}`);
// });
// const layer = Logger.replace(Logger.defaultLogger, logger);
// Override global console methods to use Effect logger
// console.log = (...args: any[]) => {
//   Effect.runSync(Effect.log(...args));
// }
const originalConsole = {
    log: globalThis.console.log,
    info: globalThis.console.info,
    warn: globalThis.console.warn,
    error: globalThis.console.error,
};
const ultraLogger = effect_1.Logger.make(({ logLevel, message }) => originalConsole.log(`[${logLevel}] ${message}`)
// Effect.sync(() => {
//   const label = logLevel.label.toUpperCase();
// })
);
const layer = effect_1.Logger.replace(effect_1.Logger.defaultLogger, ultraLogger);
console.log = (...args) => {
    // const msg = args.map(arg => typeof arg === "object" ? JSON.stringify(arg) : String(arg)).join(" ");
    effect_1.Effect.runSync(effect_1.Effect.log(...args).pipe(effect_1.Effect.provide(layer), effect_1.Effect.provide(effect_1.Logger.pretty))); // this uses ultraLogger
    originalConsole.log(...args); // optional: print raw too
};
// Save original console methods in case needed
// const originalConsoleError = console.error.bind(console)
// ... (and so on for warn, debug, etc.)
// Snapshot original console methods
// const originalConsole = {
//   log: globalThis.console.log,
//   info: globalThis.console.info,
//   warn: globalThis.console.warn,
//   error: globalThis.console.error,
// };
// // Create a custom logger that routes all Effect logs to the original console
// const ultraLogger = Logger.make((options) =>
//   Effect.sync(() => {
//     const prefix = `[${options.logLevel.label.toUpperCase()}]`;
//     const context = options.annotations ? JSON.stringify(options.annotations) : "";
//     originalConsole.log(`joe ${prefix} ${options.message} ${context}`);
//   })
// );
// // Replace the default logger with your custom one
// const loggerLayer = Logger.replace(Logger.defaultLogger, ultraLogger);
// // Map console methods to Effect log functions
// const levelMap: Record<string, (msg: string) => Effect.Effect<void>> = {
//   log: Effect.log,
//   info: Effect.logInfo,
//   warn: Effect.logWarning,
//   error: Effect.logError,
// };
// // Dynamically patch console methods
// Object.entries(levelMap).forEach(([method, logEffect]) => {
// //   const original = originalConsole[method as keyof typeof originalConsole];
//   (globalThis.console[method as keyof Console] as Function) = (...args: any[]) => {
//     const message = args.map((arg) =>
//       typeof arg === "object" ? JSON.stringify(arg) : String(arg)
//     ).join(" ");
//     logEffect(message)
//       .pipe(Effect.provide(loggerLayer), Logger.withMinimumLogLevel(LogLevel.Debug))
//     Effect.runFork(
//     );
// Effect.runFork(
//   program.pipe(
//     Logger.withMinimumLogLevel(LogLevel.Debug),
//     Effect.provide(layer)
//   )
// original(...args);
//   };
// });
// Handle uncaught exceptions and unhandled promise rejections
// process.on("uncaughtException", (error) => {
//   Effect.runSync(
//     Effect.logError(`joe Uncaught Exception: ${error.message}`, { stack: error.stack })
//       .pipe(Effect.provide(loggerLayer))
//   );
//   process.exit(1);
// });
// process.on("unhandledRejection", (reason: any) => {
//   const error = reason instanceof Error ? reason : new Error(String(reason));
//   Effect.runSync(
//     Effect.logError(`joe Unhandled Rejection: ${error.message}`, { stack: error.stack })
//       .pipe(Effect.provide(loggerLayer))
//   );
//   process.exit(1);
// });
