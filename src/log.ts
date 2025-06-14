/**
 * Initialize logging in a way that works in both Node.js and browsers.
 * Node-specific handlers are only registered when `process` is detected.
 */

let initialized = false;

function isNode(): boolean {
  const g = globalThis as any;
  return (
    typeof g.process !== 'undefined' &&
    !!g.process.versions?.node &&
    typeof g.process.on === 'function'
  );
}

function setupNode(): void {
  const proc = (globalThis as any).process as any;

  if (proc.listeners('uncaughtException').length === 0) {
    proc.on('uncaughtException', (err: unknown) => {
      console.error(err);
    });
  }

  if (proc.listeners('unhandledRejection').length === 0) {
    proc.on('unhandledRejection', (reason: unknown) => {
      console.error('Unhandled rejection', reason);
    });
  }
}

function setupBrowser(): void {
  // No-op fallback for browsers
}

export function initLogging(): void {
  if (initialized) {
    return;
  }
  initialized = true;

  if (isNode()) {
    setupNode();
  } else {
    setupBrowser();
  }
}


