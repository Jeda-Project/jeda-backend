# Code Comments

## Language

All comments must be written in **English**. No Indonesian.

## Top-of-File Docblock (REQUIRED on every source file)

Every `.ts` source file must start with a JSDoc docblock in this exact format:

```ts
/**
 * Scope: filename.ts
 * Purpose: one sentence describing what this file does.
 */
```

- `Scope` — the filename (basename only, with extension)
- `Purpose` — one sentence; describes the file's responsibility, not its implementation
- Closing tag: `*/` (JSDoc standard — never `**/`)
- Place it before all imports, above the first symbol

## Inline Comments — Prohibited

Do **not** use `//` inline comments anywhere in source files.

Let well-named identifiers, types, and the top-of-file docblock carry the meaning.
If you feel the urge to write an inline comment, it is a signal to:
- Rename the variable/function to be more descriptive, or
- Extract the logic into a named function

**The only exception** is a non-obvious constraint that cannot be expressed in code
(e.g. a driver limitation, a security invariant, a PRD cross-reference). Even then,
keep it to one line and prefer it at the top-of-file docblock level instead.

## Route Files — No Comments at All

Files matching `*.routes.ts` and `*.index.ts` (router wiring) must contain zero comments.
OpenAPI `describeRoute` blocks carry all the documentation for routes.
