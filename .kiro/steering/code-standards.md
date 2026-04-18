---
inclusion: always
---

# Code Standards & Conventions

This document defines the mandatory coding standards for
`@stackra/ts-container`. All code — new and modified — must follow these rules.

---

## 1. File Naming & Organization

### General Rules

- All file names use **lower-kebab-case** exclusively.
- Every file type has a mandatory suffix that describes its role.
- No exceptions. No `utils.ts`, no `types.ts`, no `helpers.ts`.

### Suffix Table

| Content Type     | Suffix                  | Example                       |
| ---------------- | ----------------------- | ----------------------------- |
| Interface        | `.interface.ts`         | `class-provider.interface.ts` |
| Enum             | `.enum.ts`              | `scope.enum.ts`               |
| Type alias       | `.type.ts`              | `injection-token.type.ts`     |
| Class            | `.ts` (no suffix)       | `instance-wrapper.ts`         |
| Decorator        | `.decorator.ts`         | `injectable.decorator.ts`     |
| Utility function | `.util.ts`              | `forward-ref.util.ts`         |
| React hook       | `.hook.ts`              | `use-inject.hook.ts`          |
| React component  | `.tsx`                  | `container.provider.tsx`      |
| React context    | `.context.ts`           | `container.context.ts`        |
| Constant         | `.constant.ts`          | `tokens.constant.ts`          |
| Test             | `.spec.ts` / `.test.ts` | `injector.spec.ts`            |
| Barrel export    | `index.ts`              | `src/interfaces/index.ts`     |

### Excluded Suffixes

Do **not** add suffixes to:

- Class implementation files (e.g., `injector.ts`, `module.ts`, `scanner.ts`)
- Barrel `index.ts` files

---

## 2. One Export Per File (Interfaces, Enums, Types)

### Interfaces

- Every exported `interface` lives in its **own file** inside `src/interfaces/`.
- File name: lower-kebab-case version of the interface name + `.interface.ts`.
- Examples:
  - `ClassProvider` → `src/interfaces/class-provider.interface.ts`
  - `ApplicationOptions` → `src/interfaces/application-options.interface.ts`
  - `ContainerResolver` → `src/interfaces/container-resolver.interface.ts`

### Enums

- Every exported `enum` lives in its **own file** inside `src/enums/`.
- File name: lower-kebab-case version of the enum name + `.enum.ts`.
- Example: `Scope` → `src/enums/scope.enum.ts`

### Type Aliases

- Every exported `type` alias lives in its **own file** inside `src/interfaces/`
  (for domain types) or `src/types/` (for utility types).
- File name: lower-kebab-case version of the type name + `.type.ts` or
  `.interface.ts` depending on context.
- Example: `InjectionToken` → `src/interfaces/injection-token.interface.ts`

### Type Guards

- Type guard functions (`is*`, `has*`) that belong to an interface live in the
  **same file** as that interface.
- They are exported from the same file and re-exported from the barrel.

### Constants

- All metadata key constants live in `src/constants/tokens.constant.ts`.
- Group-level constant objects (e.g., `MODULE_METADATA`) live in the same file.

---

## 3. Barrel Exports

- Every folder with multiple files **must** have an `index.ts` barrel.
- The barrel re-exports everything from the folder's files.
- Barrels use `export type { ... }` for interfaces and types.
- Barrels use `export { ... }` for classes, functions, enums, and constants.

```typescript
// Good barrel pattern
export type { ClassProvider } from './class-provider.interface';
export type { ValueProvider } from './value-provider.interface';
export { Scope } from '../enums/scope.enum';
```

---

## 4. JSDoc & Docblocks

### File-Level Docblock (Required on Every File)

Every `.ts` / `.tsx` file must start with a file-level JSDoc block that
includes:

- A one-line summary of the file's purpose.
- A longer description if the file is non-trivial (2+ sentences).
- A `@module` tag identifying the module path.

```typescript
/**
 * ClassProvider Interface
 *
 * Defines the shape of a class provider binding: `{ provide, useClass, scope? }`.
 * The container will instantiate `useClass` with resolved constructor dependencies.
 *
 * @module interfaces/class-provider
 */
```

### Class Docblock (Required)

Every exported class must have a JSDoc block with:

- Summary sentence.
- Detailed description of responsibility and lifecycle.
- `@example` block showing typical usage.

````typescript
/**
 * Wraps a single provider binding with all its metadata and cached instance.
 *
 * Created by `Module.addProvider()` for each registered provider. The injector
 * reads the wrapper's metadata to determine how to resolve the provider.
 *
 * @typeParam T - The type of the provider instance
 *
 * @example
 * ```typescript
 * const wrapper = new InstanceWrapper({ token: UserService, metatype: UserService });
 * ```
 */
export class InstanceWrapper<T = any> { ... }
````

### Method Docblock (Required on Public Methods)

Every public method must have a JSDoc block with:

- Summary sentence.
- `@param` for every parameter.
- `@returns` describing the return value.
- `@throws` for every error condition.
- `@example` for non-trivial methods.

````typescript
/**
 * Resolve a provider by its injection token.
 *
 * @typeParam T - The expected type of the resolved instance
 * @param token - The injection token (class, string, or symbol)
 * @returns The resolved provider instance
 * @throws Error if the provider is not found in any module
 *
 * @example
 * ```typescript
 * const userService = app.get(UserService);
 * ```
 */
public get<T = any>(token: InjectionToken<T>): T { ... }
````

### Private Method Docblock (Required)

Private methods must have at minimum a summary sentence and `@param` /
`@returns` tags.

### Property Docblock (Required on Public & Protected Properties)

Every public or protected class property must have a JSDoc comment:

```typescript
/**
 * The injection token used to look up this provider.
 * Can be a class, string, or symbol.
 */
public readonly token: InjectionToken;
```

### Interface Property Docblock (Required)

Every property in an interface must have a JSDoc comment explaining its purpose,
valid values, and default (if applicable):

```typescript
export interface ScopeOptions {
  /**
   * The scope of the provider.
   *
   * Controls how instances are shared:
   * - `Scope.DEFAULT` — Singleton, one instance for the whole app
   * - `Scope.TRANSIENT` — New instance per injection point
   *
   * @default Scope.DEFAULT
   */
  scope?: Scope;
}
```

### Enum Member Docblock (Required)

Every enum member must have a JSDoc comment:

```typescript
export enum Scope {
  /**
   * Singleton scope. One instance shared across all consumers.
   * This is the default when no scope option is specified.
   */
  DEFAULT = 0,

  /**
   * Transient scope. A new instance is created for every injection point.
   */
  TRANSIENT = 1,
}
```

---

## 5. Inline Comments

### Section Separators

Use ASCII section separators to group related code within a file:

```typescript
// ── Public API ───────────────────────────────────────────────────────────────

// ── Private: Resolution ──────────────────────────────────────────────────────

// ── Helpers ──────────────────────────────────────────────────────────────────
```

### Inline Explanations

Add inline comments for:

- Non-obvious logic or algorithm steps.
- Why a particular approach was chosen (not just what it does).
- Workarounds for TypeScript/bundler quirks.
- Phase labels in multi-step processes.

```typescript
// Phase 1: Scan the module tree
await scanner.scan(rootModule);

// Phase 2: Create all provider instances
await instanceLoader.createInstances();

// Circular dependency detection — if token is already in the stack, throw
if (this.resolutionStack.has(wrapper.token)) { ... }
```

---

## 6. TypeScript Conventions

### Imports

- Use `import type { ... }` for type-only imports.
- Group imports: external → internal (path aliases) → relative.
- Use `@/` path alias for `src/` imports.

```typescript
import 'reflect-metadata'; // side-effect
import type { InjectionToken, Type } from '@/interfaces'; // internal types
import { Scope } from '@/enums'; // internal values
import { InstanceWrapper } from './instance-wrapper'; // relative
```

### Generics

- Always document generic type parameters with `@typeParam` in JSDoc.
- Use descriptive names: `T` for the primary type, `K` for keys, `V` for values.

### Access Modifiers

- Always explicit: `public`, `private`, or `protected`. Never implicit.
- Use `readonly` for properties that don't change after construction.

### Return Types

- Always annotate return types on public methods.
- Annotate private method return types when non-obvious.

---

## 7. Utility Functions

- All utility functions live in `src/utils/` with the `.util.ts` suffix.
- Each utility function file exports one primary function.
- Helper functions used only within the utility file are not exported.
- Every utility function must have a full JSDoc docblock with `@param`,
  `@returns`, and `@example`.

```
src/utils/
  forward-ref.util.ts    → forwardRef()
  get-token-name.util.ts → getTokenName()  (if extracted)
```

---

## 8. React Hooks

- All hooks live in `src/hooks/<hook-name>/` with the `.hook.ts` suffix.
- Each hook folder has an `index.ts` barrel.
- Hook files export exactly one hook function.
- Hooks must document: what they return, when they throw, and memoization
  behavior.

```
src/hooks/
  use-inject/
    index.ts
    use-inject.hook.ts
  use-container/
    index.ts
    use-container.hook.ts
```

---

## 9. Decorators

- All decorators live in `src/decorators/` with the `.decorator.ts` suffix.
- Each decorator file exports exactly one decorator function.
- Decorator docblocks must explain: what metadata is written, what reads it, and
  when it runs.

---

## 10. Constants

- All metadata key constants live in `src/constants/tokens.constant.ts`.
- Constants use `UPPER_SNAKE_CASE`.
- Group related constants with section comments.
- Every constant must have a JSDoc comment explaining what writes it and what
  reads it.

---

## 11. Folder Structure Reference

```
src/
  application/          # Bootstrap entry point (Application, global singleton)
  constants/            # Metadata key constants (*.constant.ts)
  contexts/             # React contexts (*.context.ts)
  decorators/           # Decorators (*.decorator.ts)
  enums/                # Enums (*.enum.ts)
  hooks/                # React hooks (use-*/index.ts + use-*.hook.ts)
  injector/             # DI engine (container, module, injector, scanner, etc.)
  interfaces/           # Interfaces & type aliases (*.interface.ts)
  providers/            # React providers (*.tsx)
  utils/                # Utility functions (*.util.ts)
  index.ts              # Public API barrel
```

---

## 12. Checklist Before Committing

- [ ] Every new interface is in its own `*.interface.ts` file in
      `src/interfaces/`
- [ ] Every new enum is in its own `*.enum.ts` file in `src/enums/`
- [ ] Every new type alias is in its own `*.interface.ts` or `*.type.ts` file
- [ ] Every new utility function is in `src/utils/*.util.ts`
- [ ] Every new React hook is in `src/hooks/use-*/use-*.hook.ts`
- [ ] Every new decorator is in `src/decorators/*.decorator.ts`
- [ ] Every new constant is in `src/constants/*.constant.ts`
- [ ] All barrel `index.ts` files are updated
- [ ] Every exported symbol has a JSDoc docblock
- [ ] Every public method has `@param`, `@returns`, and `@throws` tags
- [ ] Every interface property has a JSDoc comment
- [ ] Every enum member has a JSDoc comment
- [ ] File starts with a file-level `@module` docblock
- [ ] Imports use `import type` for type-only imports
- [ ] All public method return types are explicitly annotated
