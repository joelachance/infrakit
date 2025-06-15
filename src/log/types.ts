/**
 * Options for configuring logging behaviour.
 */
export interface LoggingOptions {
  /** Enable pretty logging using `Logger.pretty`. */
  pretty?: boolean;
  /** Use the native console methods instead of Effect. */
  raw?: boolean;
}
