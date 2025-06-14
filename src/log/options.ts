import { LoggingOptions } from './types';

/**
 * Global logging configuration. Values here are used unless overridden
 * by per-call options.
 */
export let globalOptions: Required<LoggingOptions> = {
  pretty: false,
  timestamp: false,
  label: true,
  raw: false,
};

/**
 * Updates the global logging configuration by merging the provided
 * options with the existing defaults.
 *
 * @param opts Partial configuration to merge with the defaults.
 */
export function configureLogging(opts: LoggingOptions = {}): void {
  globalOptions = { ...globalOptions, ...opts };
}
