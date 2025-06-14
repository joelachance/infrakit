import { configureLogging, captureErrors, effectLogError } from './log';

configureLogging({ pretty: true });
captureErrors();

import('./index').catch((err) => {
  effectLogError(err);
  process.exitCode = 1;
});
