# TypeScript Conventions

- Use arrow functions instead of `function` declarations:
  ```ts
  // ✗
  function doThing(x: string): number { ... }

  // ✓
  const doThing = (x: string): number => { ... };
  ```

- Avoid `null`; prefer `undefined`:
  ```ts
  // ✗
  let value: string | null = null;

  // ✓
  let value: string | undefined;
  ```

- Use optional properties (`?`) instead of explicit `| undefined` unions:
  ```ts
  // ✗
  interface Props { label: string | undefined; }

  // ✓
  interface Props { label?: string; }
  ```

- When using Zod, define a schema constant then derive the type with `z.infer`. Never write a separate `interface` for a Zod-validated shape:
  ```ts
  // ✗
  interface Foo { bar: string; }

  // ✓
  export const FooSchema = z.object({
    bar: z.string(),
  });
  export type Foo = z.infer<typeof FooSchema>;
  ```

- Use PascalCase for `const` names, not SCREAMING_SNAKE_CASE:
  ```ts
  // ✗
  const PING_INTERVAL_MS = 3000;
  const STARLINK_ADDRESS = '192.168.100.1:9200';

  // ✓
  const PingIntervalMs = 3000;
  const StarlinkAddress = '192.168.100.1:9200';
  ```
