# Plan 002: CLI JSON Persistence

## Spec ID

002

## Problem and approach

Add automatic persistence for CLI task operations by storing all CLI task state in one fixed project-root `tasks.json` file. Preserve the existing process-local behavior only when the CLI does not use the JSON-backed store. The implementation will keep persistence in the store layer, service rules in the service layer, and argument parsing/output in the CLI boundary.

## Architecture

### `src/cli.ts`

- Use the JSON-backed task store for every CLI process instead of constructing the in-memory store directly.
- Resolve the fixed `tasks.json` path from the project root.
- Parse and validate existing CLI arguments before loading or mutating state.
- Translate storage and domain failures into CLI failure output and non-zero exit codes.

### `src/store/`

- Extend the existing `TaskStore` abstraction only if persistence requires lifecycle methods, or keep it unchanged and add a JSON implementation of the current contract.
- Add a JSON-backed store that implements `create`, `list`, `findByTitle`, `conclude`, and `remove` in `src/store/json-task-store.ts`.
- Load `tasks.json` when the store is created or for each operation, normalize and validate the loaded state, apply changes in memory, and persist successful mutations.
- Keep the in-memory store available for HTTP and tests that do not require disk persistence.

### `src/service/`

- No persistence implementation should be added here.
- Existing service functions remain the owner of title validation, uniqueness, filtering, conclusion, and removal rules.
- The JSON store supplies stored data without service-layer knowledge of the file system.

### `src/domain/`

- Add storage-related domain error types only if needed for malformed JSON, invalid state, read failures, or write failures.
- Zod remains the boundary validator for external CLI arguments and loaded JSON state.
- Domain code remains free of file-system I/O.

### HTTP boundary

- No HTTP files, routes, server behavior, or stores should change for this feature.

## Data model

- Existing `Task` remains:
  - `title: string`, trimmed and preserving display casing.
  - `done: boolean`.
- Existing `TaskFilterSchema` remains unchanged for `all`, `open`, and `done`.

### Proposed JSON document shape

A proposed top-level object is:

```json
{
  "tasks": [
    { "title": "Write tests", "done": false }
  ]
}
```

The equivalent array form, `[ { "title": "Write tests", "done": false } ]`, is an alternative that is simpler but less extensible. The object form is proposed because it can carry future metadata, but it requires human review because the specification leaves the representation unspecified.

### Proposed validation

- Add a reusable Zod schema for a loaded task file containing a `tasks` array.
- Each loaded task must have a nonblank, already-trimmed string title and a boolean `done` value.
- Apply case-insensitive uniqueness validation across loaded titles.
- Reject unknown data that affects task integrity rather than silently repairing it.

No additional HTTP request schema is required.

## Contracts

### CLI contract

The existing commands remain unchanged:

- `npm run cli -- create "Write tests"`
- `npm run cli -- list`
- `npm run cli -- list --filter open`
- `npm run cli -- list --filter done`
- `npm run cli -- conclude "Write tests"`
- `npm run cli -- remove "Write tests"`

Every command loads the fixed project-root `tasks.json` before execution. Create, conclude, and remove persist the resulting state after success; list performs no write. No new CLI option or user-provided file path is introduced.

### HTTP contract

Not applicable. The HTTP API continues to use process-local task state and does not read or write `tasks.json`.

## Decisions and trade-offs

### Approved decisions

- Canonical JSON shape: `{ "tasks": [...] }`, with each task containing `title` and `done`.
- Project-root resolution: the directory containing `package.json`, relative to the CLI entrypoint rather than the caller's working directory.
- Mutation writes: atomic replacement through a sibling temporary file and rename.
- Missing file behavior: every CLI command, including `list`, initializes `{ "tasks": [] }`; no user-provided path is accepted.
- Storage failures: use distinct, clear domain messages for malformed JSON, invalid state, read errors, and write errors.

1. **Fixed project-root file location**
   - Proposed: resolve `tasks.json` relative to the repository/project root used by the CLI entrypoint.
   - Alternative: resolve relative to the current working directory.
   - Trade-off: project-root resolution makes invocations consistent from any working directory only if the root is detectable reliably; current-directory resolution is simpler but can scatter files across directories.
   - Human review: resolved. Use the directory containing `package.json`, relative to the CLI entrypoint.

2. **JSON document representation**
   - Proposed: `{ "tasks": [...] }` as the canonical file shape.
   - Alternative: top-level array of task objects.
   - Trade-off: the object form is explicit and extensible; the array is smaller and easy to inspect.
   - Human review: resolved. Use `{ "tasks": [...] }` as the canonical document shape.

3. **Atomic writes**
   - Proposed: write to a temporary sibling file, validate it, then replace `tasks.json` so successful writes are complete and failed writes do not truncate the original.
   - Alternative: write the JSON document directly to `tasks.json`.
   - Trade-off: atomic replacement protects the original file but depends on filesystem rename support; direct writes are simpler and risk partial files.
   - Human review: resolved. Use atomic replacement for successful mutation writes.

4. **Missing file behavior**
   - Proposed: initialize state as an empty task list and create `tasks.json` after a successful mutating operation.
   - Alternative: create an empty file when every CLI process starts, including list-only commands.
   - Trade-off: the first option avoids writes for read-only commands; the second makes file presence deterministic.
   - Human review: resolved. Missing files are initialized as `{ "tasks": [] }` by every CLI operation.

5. **Persistence failure classes**
   - Proposed: add clear storage-domain errors for malformed JSON, invalid state, read failure, and write failure.
   - Alternative: throw and translate raw filesystem or JSON parsing errors at the CLI boundary.
   - Trade-off: dedicated errors are consistent with the constitution and reduce boundary-specific checks; raw errors expose implementation detail and may be inconsistent.
   - Human review: resolved. Use distinct storage-domain messages for malformed JSON, invalid state, read, and write failures.

## Test strategy

- Add `src/store/json-task-store.test.ts` using `node:test` and `tsx`.
- Test initial state when the project-root task file is absent.
- Test create, list, conclude, and remove across separate store instances, simulating separate CLI sessions.
- Verify title trimming, display casing, case-insensitive uniqueness, and open/done filters after reload.
- Test malformed JSON, invalid task objects, duplicate titles in loaded data, read failures, and write failures.
- Verify failed mutations leave existing file contents unchanged.
- Add CLI subprocess or direct CLI tests for create/list/conclude/remove across separate invocations using the fixed task file.
- Verify CLI commands without persistence flags still use the same automatic file behavior; every command loads the fixed file.
- Verify HTTP behavior remains unchanged and never touches `tasks.json`.
- Run the complete `npm test` suite and `npm run typecheck` after implementation.

## Risks and human review

### Human review gate

All material persistence decisions have been approved and recorded above. Implementation may proceed with these resolved choices.

### Material risks

- Resolving the project root differently between environments could make the fixed file location inconsistent.
- Concurrent CLI sessions modifying the same file are explicitly out of scope, so lost updates remain possible.
- A partial write could corrupt task state unless atomic replacement is used.
- Loading external or previously edited JSON requires strict validation to prevent duplicate, blank, or malformed task data.
- The fixed file must be documented and ignored by Git if task state is user-specific; adding ignore rules requires review because it is not specified.
