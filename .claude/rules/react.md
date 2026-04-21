---
globs: src/renderer/src/**/*.tsx
---

# React Conventions

- One component per file; co-locate tiny helper components in the same file only if they are not reused elsewhere
- Use arrow functions typed with `FC<Props>`:
  ```tsx
  export const MyComponent: FC<Props> = ({ ... }) => { ... };
  export default MyComponent;
  ```
- Define props as an `interface`, not a `type` alias:
  ```tsx
  interface Props extends StyleProps, TestIdProps {
    label: string;
  }
  ```
- Default export mirrors the named export at the bottom of the file
