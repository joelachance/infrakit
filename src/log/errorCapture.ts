import { effectLogError } from './console';

let handlersRegistered = false;

/**
 * Registers global handlers for uncaught exceptions and unhandled promise
 * rejections so that they are logged via Effect.
 */
export function captureErrors(): void {
  if (handlersRegistered) {
    return;
  }
  handlersRegistered = true;

  process.removeAllListeners('uncaughtException');
  process.removeAllListeners('unhandledRejection');

  process.on('uncaughtException', (err) => {
    effectLogError(err);
    process.exitCode = 1;
  });

  process.on('unhandledRejection', (reason) => {
    effectLogError(reason as any);
    process.exitCode = 1;
  });
}
