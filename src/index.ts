import { configureLogging, captureErrors } from './log';

configureLogging({ pretty: true });
captureErrors();

console.log("Hello, world!");
console.log("Raw message", { raw: true });
console.warn("Warning!");
console.error(new Error("Boom"));
console.info("Some info");
