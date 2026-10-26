# notes-api Project Memory

## Stack
- Node.js 24 LTS.
- TypeScript with ESM and strict mode.
- Zod validates inputs at HTTP and CLI boundaries.

## Tests
- Use Node.js's built-in test runner through `tsx`.
- Do not add an HTTP framework.

## Commands
- `dev` (localhost:3000): `tsx src/index.ts`
- `cli`: `tsx src/cli.ts`
- `test`: `node --import tsx --test "src/**/*.test.ts"`
- `typecheck`: `tsc --noEmit`

## Structure
- `src/domain`: types and Zod schemas; no I/O.
- `src/store`: in-memory persistence behind an interface.
- `src/service`: business rules.
- `src/http`: HTTP boundary.
- `src/cli.ts`: CLI boundary.
- `specs/`: spec-driven development artifacts.

## Conventions
- Keep the flow HTTP/CLI → service → store; do not skip layers.
- Validate external inputs with Zod.
- Translate domain errors at HTTP and CLI boundaries.
- Add tests for all new logic.
- Keep typechecking green.
- Never read or commit secrets or `.env` files.

## Workflow
- Follow `/spec` → `/plan` → `/tasks` → `/implementation`.
- Validate every phase with a human reviewer.
- Store all workflow artifacts in `specs/`.
