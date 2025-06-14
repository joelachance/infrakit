/**
 * Options for configuring logging behaviour.
 */
export interface LoggingOptions {
  /** Enable pretty logging using `Logger.pretty`. */
  pretty?: boolean;
  /** Prepend timestamps to each log message. */
  timestamp?: boolean;
  /** Include the log level label in messages. */
  label?: boolean;
  /** Use the native console methods instead of Effect. */
  raw?: boolean;
}
