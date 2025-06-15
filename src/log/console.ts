import { Effect, Logger, pipe } from 'effect';
import { LoggingOptions } from './types';
import { globalOptions } from './options';
import { explainError } from './errorExplain';

// Save original console methods for restoration and raw logging.
export const originalConsoleLog = console.log.bind(console);
export const originalConsoleInfo = console.info.bind(console);
export const originalConsoleWarn = console.warn.bind(console);
export const originalConsoleError = console.error.bind(console);

/**
 * Create a custom logger that writes log level and message to the
 * original console.
 */
function makeCustomLogger(opts: Required<LoggingOptions>): Logger.Logger<unknown, void> {
  return Logger.make(({ logLevel, message }) => {
    const parts: unknown[] = [];
    if (opts.timestamp) {
      parts.push(new Date().toISOString());
    }
    if (opts.label) {
      parts.push(`[${logLevel.label}]`);
    }
    const msg = Array.isArray(message) ? message : [message];
    originalConsoleLog(...parts, ...msg);
  });
}

/**
 * Extract logging options from the end of an argument list.
 */
function parseOptions(args: unknown[]): [unknown[], LoggingOptions] {
  if (
    args.length > 0 &&
    typeof args[args.length - 1] === 'object' &&
    args[args.length - 1] !== null
  ) {
    const maybeOpts = args[args.length - 1] as Record<string, unknown>;
    const hasOpts =
      'pretty' in maybeOpts ||
      'raw' in maybeOpts ||
      'timestamp' in maybeOpts ||
      'label' in maybeOpts;
    if (hasOpts) {
      const opts: LoggingOptions = {
        pretty: maybeOpts.pretty as boolean | undefined,
        raw: maybeOpts.raw as boolean | undefined,
        timestamp: maybeOpts.timestamp as boolean | undefined,
        label: maybeOpts.label as boolean | undefined,
      };
      return [args.slice(0, -1), opts];
    }
  }
  return [args, {}];
}

/**
 * Run an Effect synchronously using either pretty logging or a custom logger
 * that respects the configured options.
 */
function runEffect(effect: Effect.Effect<void, never, never>, opts: Required<LoggingOptions>): void {
  const layer = opts.pretty
    ? Logger.pretty
    : Logger.replace(Logger.defaultLogger, makeCustomLogger(opts));

  const current = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
  };

  console.log = originalConsoleLog;
  console.info = originalConsoleInfo;
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;

  try {
    pipe(effect, Effect.provide(layer), Effect.runSync);
  } finally {
    console.log = current.log;
    console.info = current.info;
    console.warn = current.warn;
    console.error = current.error;
  }
}



/**
 * Log using an Effect logger, applying per-call and global options.
 */
function effectLogWith(
  effectFn: (...msg: ReadonlyArray<any>) => Effect.Effect<void, never, never>,
  fallback: (...args: unknown[]) => void,
  ...input: unknown[]
): string | null {
  const [args, local] = parseOptions(input);
  const opts: Required<LoggingOptions> = { ...globalOptions, ...local } as Required<LoggingOptions>;

  let trace: string | null = null;

  if (opts.raw) {
    fallback(...args);
    return null;
  }

  if (effectFn === Effect.logError) {
    for (let i = 0; i < args.length; i++) {
      const val = args[i];
      if (val instanceof Error) {
        if (typeof val.stack === 'string') {
          trace = val.stack;
        }
        args[i] = val.toString();
      } else if (val && typeof val === 'object' && 'stack' in val) {
        const stack = (val as any).stack;
        if (typeof stack === 'string') {
          trace = stack;
        }
        args[i] = String(val);
      }
    }
  }

  runEffect(effectFn(...args), opts);
  return trace;
}

/**
 * Public helper to log messages via Effect.
 */
export function effectLog(...input: unknown[]): void {
  effectLogWith(Effect.log, originalConsoleLog, ...input);
}

/**
 * Public helper to log errors via Effect while capturing the stack trace.
 */
export function effectLogError(...input: unknown[]): void {
  const trace = effectLogWith(Effect.logError, originalConsoleError, ...input);
  if (trace) {
    void explainError(trace).then((summary) => {
      if (summary) {
        originalConsoleLog(summary);
      }
    });
  }
}

/**
 * Console replacement for `console.log` routed through Effect.
 */
function effectConsoleLog(...args: unknown[]): void {
  effectLogWith(Effect.log, originalConsoleLog, ...args);
}
/**
 * Console replacement for `console.info` routed through Effect.
 */
function effectConsoleInfo(...args: unknown[]): void {
  effectLogWith(Effect.logInfo, originalConsoleInfo, ...args);
}
/**
 * Console replacement for `console.warn` routed through Effect.
 */
function effectConsoleWarn(...args: unknown[]): void {
  effectLogWith(Effect.logWarning, originalConsoleWarn, ...args);
}
/**
 * Console replacement for `console.error` routed through Effect.
 */
function effectConsoleError(...args: unknown[]): void {
  effectLogError(...args);
}

/**
 * Patch the global console methods so that all logging is routed
 * through the Effect logger.
 */
export function patchConsole(): void {
  console.log = effectConsoleLog;
  console.info = effectConsoleInfo;
  console.warn = effectConsoleWarn;
  console.error = effectConsoleError;
}
