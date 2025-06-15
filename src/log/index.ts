import { Effect, Logger, LogLevel, pipe } from "effect";
export * from './console';
export * from './errorCapture';
export * from './options';
export * from './errorExplain';

interface LogConfig {
  pretty?: boolean;
}

export function configureLogging(config: LogConfig = {}) {
  const originalConsole = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
  };

  const ultraLogger = Logger.make(({ logLevel, message }) =>
    Effect.sync(() => {
      const level = logLevel.label.toUpperCase();
      const prefix = config.pretty ? `[${level}]` : level;
      originalConsole.log(`${prefix} ${message}`);
    })
  );

  const layer = Logger.replace(Logger.defaultLogger, ultraLogger);

  const methodToEffect: Record<string, (msg: string) => Effect.Effect<void>> = {
    log: Effect.log,
    info: Effect.logInfo,
    warn: Effect.logWarning,
    error: Effect.logError,
  };

  for (const method of Object.keys(methodToEffect)) {
    const effectLogFn = methodToEffect[method];
    const original = originalConsole[method as keyof typeof originalConsole];

    (console[method as keyof Console] as unknown as Function) = (...args: any[]) => {
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
      original(...args);
    };
  }
}

export function captureErrors() {
  process.on("uncaughtException", (error) => {
    console.error(error);
    process.exit(1);
  });

  process.on("unhandledRejection", (reason: any) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    console.error(error);
    process.exit(1);
  });
}
