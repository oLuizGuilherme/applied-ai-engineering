# Implementation Tasks: CLI JSON Persistence

**Specification:** `specs/002-cli-json-persistence-spec.md`  
**Plan:** `specs/002-cli-json-persistence-plan.md`  
**Spec ID:** 002

## Tasks

- [x] **T001: Add persisted-task storage domain errors**
  - **Description:** Define clear domain error classes for unreadable JSON task state, invalid task state, malformed JSON, and write failures without adding file-system I/O.
  - **Dependencies:** none
  - **Completion criteria:** Dedicated exported domain errors distinguish storage read, parse, validation, and write failures; each error has a stable type and clear message suitable for CLI translation.
  - **Tests:** Add focused node:test cases for each storage error type and message; run `npm test` and `npm run typecheck`.

- [x] **T002: Add JSON task-state validation contracts**
  - **Description:** Add Zod schemas and TypeScript types for validating the persisted task-file document after loading it.
  - **Dependencies:** T001
  - **Completion criteria:** The contracts reject malformed task documents, blank titles, invalid done flags, and duplicate case-insensitive titles; valid loaded tasks preserve their stored casing.
  - **Tests:** Add node:test cases for valid state, malformed documents, blank titles, invalid flags, duplicate titles, and unknown data; run `npm test` and `npm run typecheck`.

- [x] **Review Gate 002: Approve JSON persistence decisions**
  - **Description:** Pause implementation before adding file-system behavior and review the project-root resolution, canonical JSON shape, atomic-write policy, missing-file behavior for list operations, and storage error text.
  - **Dependencies:** T001, T002
  - **Completion criteria:** A human reviewer approves the five unresolved persistence decisions in the plan and records the decisions in the plan or implementation notes before JSON-store work begins. Approved decisions: package-root `tasks.json`, `{ "tasks": [...] }`, atomic writes, initialization on missing-file operations, and distinct storage-domain messages.
  - **Tests:** Review a contract checklist covering missing files, malformed files, invalid state, read/write failures, unchanged files after failures, and atomic mutation; no application implementation or file-format code is changed during this gate.

- [x] **T003: Implement project-root task-file path resolution**
  - **Description:** Add a small store-layer helper that resolves the fixed `tasks.json` path at the approved project-root location.
  - **Dependencies:** Review Gate 002
  - **Completion criteria:** The CLI can consistently determine the same task-file path across supported working-directory assumptions, with no user-provided path argument.
  - **Tests:** Add node:test cases for the approved project-root resolution behavior and run `npm test` plus `npm run typecheck`.

- [x] **T004: Implement JSON task-file loading and validation**
  - **Description:** Add store-layer logic that loads `tasks.json`, returns an empty task list when the approved missing-file behavior applies, and validates existing content before exposing it.
  - **Dependencies:** Review Gate 002, T002, T003
  - **Completion criteria:** Missing files produce approved empty-state behavior; malformed JSON, invalid state, and read failures raise dedicated storage errors; valid loaded state is exposed without overwriting the file.
  - **Tests:** Add node:test cases for missing, valid, malformed, invalid, unreadable, and duplicate-title JSON files; run `npm test` and `npm run typecheck`.

- [x] **T005: Implement JSON task-store create and list operations**
  - **Description:** Add a JSON-backed `TaskStore` implementation for loading state, creating tasks, and listing all/open/done tasks using the existing store contract.
  - **Dependencies:** T004
  - **Completion criteria:** Creation trims and stores titles through existing service rules, preserves casing, rejects duplicates case-insensitively, starts tasks open, and writes successful mutations to `tasks.json`; list reads state and does not write unnecessarily.
  - **Tests:** Add node:test cases across separate store instances for create/list persistence, filters, casing, duplicate titles, and missing-file behavior; run `npm test` and `npm run typecheck`.

- [x] **T006: Implement JSON task-store conclude and remove operations**
  - **Description:** Complete the JSON-backed store with case-insensitive conclude and remove operations that persist successful mutations.
  - **Dependencies:** T005
  - **Completion criteria:** Conclusion marks matching tasks done across store instances; remove deletes matching tasks across store instances; missing lookups report not found and leave the task file unchanged.
  - **Tests:** Add node:test cases for open, done, casing variants, missing titles, successful persistence, and unchanged files after failed mutations; run `npm test` and `npm run typecheck`.

- [x] **T007: Add atomic and failure-safe JSON writes**
  - **Description:** Implement the approved write policy for JSON mutations, preserving the original file on validation, serialization, and filesystem write failures.
  - **Dependencies:** T006
  - **Completion criteria:** Successful mutations replace the JSON task state safely; write/serialization failures produce dedicated storage errors; no failed mutation truncates or overwrites the original file.
  - **Tests:** Add node:test cases for successful replacement, write failure, malformed state before write, and unchanged original bytes after failure; run `npm test` and `npm run typecheck`.

- [x] **T008: Wire the CLI entrypoint to the JSON task store**
  - **Description:** Replace or add the CLI process setup so every existing create, list, conclude, and remove invocation automatically uses the fixed project-root JSON store.
  - **Dependencies:** T007
  - **Completion criteria:** Existing CLI commands require no file-path option, load `tasks.json` before each operation, persist successful mutations, and leave HTTP behavior unchanged.
  - **Tests:** Add subprocess or direct CLI tests for all commands across separate invocations, missing files, filters, blank/duplicate titles, missing tasks, malformed state, and read/write failures; run `npm test` and `npm run typecheck`.

- [x] **T009: Translate JSON storage errors at the CLI boundary**
  - **Description:** Convert persistence domain errors into clear CLI success/failure output and process exit behavior without exposing raw stack traces.
  - **Dependencies:** T008
  - **Completion criteria:** Read, parse, validation, and write storage failures produce approved clear messages and non-zero exit codes; existing task-domain failures retain their current CLI behavior.
  - **Tests:** Add CLI boundary node:test cases for each storage error and existing not-found, validation, and duplicate errors; run `npm test` and `npm run typecheck`.

- [x] **T010: Verify cross-session persistence and HTTP isolation**
  - **Description:** Add end-to-end verification proving separate CLI processes share the fixed JSON state while HTTP operations remain process-local and do not read or write `tasks.json`.
  - **Dependencies:** T009
  - **Completion criteria:** Create/list/conclude/remove operations work across separate CLI processes using `tasks.json`; HTTP operations and files remain independent; malformed or unwritable state is handled consistently at the CLI boundary.
  - **Tests:** Run `npm test` and `npm run typecheck`, plus subprocess CLI smoke tests for create/list/conclude/remove, and HTTP smoke tests confirming `tasks.json` is not touched.

- [x] **T011: Document JSON persistence usage and failure behavior**
  - **Description:** Update user-facing documentation only to describe automatic use of project-root `tasks.json`, existing CLI commands, missing-file behavior, and storage failures.
  - **Dependencies:** T010
  - **Completion criteria:** Documentation accurately shows that no file path is supplied, names the fixed file, and describes that state persists across CLI sessions while HTTP remains separate.
  - **Tests:** Run `npm test` and `npm run typecheck` after documentation changes, and verify the documented CLI commands against the implementation.
