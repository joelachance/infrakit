import { initLogging } from './log';

initLogging();

console.log("Hello, world!");
console.warn("Warning!");
console.error(new Error("Boom"));

