# Infrakit

A modern utility package for your Node.js applications.

## Installation

```bash
npm install infrakit
```

## Usage

```typescript
import { greet } from 'infrakit';

// Use the greet function
const message = greet('World');
console.log(message); // Output: Hello, World!
```

## API Reference

### `greet(name: string): string`

Returns a greeting message for the given name.

### Types

#### `Config`
```typescript
interface Config {
  name: string;
  version: string;
}
```

#### `Options`
```typescript
interface Options {
  debug?: boolean;
  timeout?: number;
}
```

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Run tests: `npm test`

## License

MIT 