import { patchConsole } from './console';

export { LoggingOptions } from './types';
export { globalOptions, configureLogging } from './options';
export {
  effectLog,
  effectLogError,
  lastErrorBacktrace,
  patchConsole,
  originalConsoleLog,
  originalConsoleInfo,
  originalConsoleWarn,
  originalConsoleError,
} from './console';
export { captureErrors } from './errorCapture';

// Patch console on module load so application code automatically
// routes through the Effect logger.
patchConsole();
