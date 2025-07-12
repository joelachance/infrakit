import { effectLogError } from './console';
import { explainError } from './errorExplain';

let handlersRegistered = false;

/**
 * Registers global handlers for uncaught exceptions and unhandled promise
 * rejections so that they are logged via Effect and explained using AI.
 */
export function captureErrors(): void {
  if (handlersRegistered) {
    return;
  }
  handlersRegistered = true;

  process.removeAllListeners('uncaughtException');
  process.removeAllListeners('unhandledRejection');

  process.on('uncaughtException', async (err) => {
    effectLogError(err);
    const explanation = await explainError(err.stack);
    if (explanation) {
      console.log('\nError Analysis:', explanation);
    }
    process.exitCode = 1;
  });

  process.on('unhandledRejection', async (reason) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    effectLogError(error);
    const explanation = await explainError(error.stack);
    if (explanation) {
      console.log('\nError Analysis:', explanation);
    }
    process.exitCode = 1;
  });
}
