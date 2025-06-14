import { configureLogging, captureErrors } from './log';

configureLogging({ pretty: true });
captureErrors();

import('./index');
