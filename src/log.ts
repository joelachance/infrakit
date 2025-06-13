import { Effect, Logger, LogLevel, pipe, Runtime } from "effect";

// 1. Capture original console methods
const originalConsole = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
};

// 2. Create the custom logger
const ultraLogger = Logger.make(({ logLevel, message }) =>
  Effect.sync(() => {
    const level = logLevel.label.toUpperCase();
    originalConsole.log(`[${level}] ${message}`);
  })
);

// 3. Create and install the logger layer into a runtime
const layer = Logger.replace(Logger.defaultLogger, ultraLogger);

// 4. Patch console methods to log via the configured runtime
type ConsoleMethod = "log" | "info" | "warn" | "error";

const methodToEffect: Record<ConsoleMethod, (msg: string) => Effect.Effect<void>> = {
  log: Effect.log,
  info: Effect.logInfo,
  warn: Effect.logWarning,
  error: Effect.logError,
};

for (const method of Object.keys(methodToEffect) as ConsoleMethod[]) {
  const effectLogFn = methodToEffect[method];
  const original = originalConsole[method];

  console[method] = (...args: any[]) => {
    const message = args
      .map((arg) =>
        typeof arg === "object" ? JSON.stringify(arg) : String(arg)
      )
      .join(" ");

    Effect.runSync(
      effectLogFn(message).pipe(
        Effect.provide(layer),
        Logger.withMinimumLogLevel(LogLevel.Debug)
      )
    );
    original(...args); // Optional: still echo to console directly
  };
}
