# Implementation Tasks: Task Management Feature

**Specification:** `specs/001-task-management-spec.md`  
**Plan:** `specs/001-task-management-plan.md`  
**Spec ID:** 001

## Tasks

- [x] **T001: Define task domain types and validation contracts**
  - **Description:** Add the `Task` domain shape, task filter type, title normalization/lookup schemas, and reusable boundary validation schemas in `src/domain/`.
  - **Dependencies:** none
  - **Completion criteria:** The domain module exposes the task model, trimmed title and lookup contracts, and `all`/`open`/`done` filter validation without any I/O dependencies.
  - **Tests:** Add focused node:test cases proving whitespace-only titles are rejected, surrounding whitespace is trimmed, and valid lookup/filter values are accepted; run `npm test` and `npm run typecheck`.

- [x] **T002: Add task domain error classes**
  - **Description:** Define predictable domain errors for blank titles, duplicate titles, and missing tasks so service rules have stable error types.
  - **Dependencies:** T001
  - **Completion criteria:** Each specified failure has a dedicated exported domain error class with a clear message and type that boundaries can translate.
  - **Tests:** Add node:test cases for the error types and messages; run the focused tests, full `npm test`, and `npm run typecheck`.

- [x] **T003: Define the task store contract**
  - **Description:** Add the store interface and in-memory task record operations needed for create, list, conclude, and remove behavior.
  - **Dependencies:** T001
  - **Completion criteria:** The store contract is typed with strict TypeScript, has no HTTP or CLI dependencies, and defines case-insensitive lookup by normalized title key.
  - **Tests:** Add compile-level contract tests or a mock implementation in a node:test file, then run `npm test` and `npm run typecheck`.

- [x] **T004: Implement the in-memory task store**
  - **Description:** Create the in-memory store implementation behind the interface with create, filtered list, conclude, and remove operations.
  - **Dependencies:** T002, T003
  - **Completion criteria:** The implementation persists task state between calls, compares titles case-insensitively for lookup and uniqueness, preserves stored casing, and returns all/open/done subsets.
  - **Tests:** Add node:test cases for create/list/filter/conclude/remove behavior and duplicate/missing lookups; run `npm test` and `npm run typecheck`.

- [x] **T005: Implement task creation and listing service rules**
  - **Description:** Add service functions for creating tasks and listing all, open, or done tasks while keeping title normalization and uniqueness rules centralized.
  - **Dependencies:** T002, T004
  - **Completion criteria:** Creation trims titles, preserves original casing, starts tasks as open, rejects blanks with `TaskValidationError`, and rejects duplicates ignoring case with `TaskAlreadyExistsError`; listing supports every filter without changing stored state.
  - **Tests:** Add focused service node:test cases for trimmed casing, blank titles, duplicate titles, and all/open/done filters; run `npm test` and `npm run typecheck`.

- [x] **T006: Implement task conclude and remove service rules**
  - **Description:** Add service functions that conclude and remove tasks by case-insensitive title lookup, whether the task is open or done.
  - **Dependencies:** T004, T005
  - **Completion criteria:** Concluding marks the matching task done regardless of prior state; remove deletes it; both operations return `TaskNotFoundError` when no title matches; normal title casing does not affect lookup.
  - **Tests:** Add service node:test cases for open, done, and casing variants, plus missing-title conclude/remove failures; run `npm test` and `npm run typecheck`.

- [x] **Review Gate 001: Review boundary surface decisions**
  - **Description:** Pause implementation before boundary work and review proposed HTTP routes, request/response shapes, CLI command syntax, and output/error conventions against repository patterns.
  - **Dependencies:** T005, T006
  - **Completion criteria:** A human reviewer approves concrete HTTP and CLI contracts for create, list, conclude, and remove; approved decisions are recorded in the implementation notes or relevant spec/plan artifact before boundary implementation starts.
  - **Tests:** Review a boundary-contract checklist for validation, success outcomes, domain-error translation, and consistency between HTTP and CLI; no application implementation is changed during this gate.

- [x] **T007: Implement and test shared HTTP boundary helpers**
  - **Description:** Add thin HTTP parsing and response helpers that validate external inputs with Zod and translate domain errors without duplicating task rules.
  - **Dependencies:** Review Gate 001, T006
  - **Completion criteria:** HTTP helpers use Zod for title/filter/lookup inputs and map validation, duplicate, and not-found domain errors to clear user-facing failures; they contain no task business logic.
  - **Tests:** Add node:http or direct boundary node:test cases for valid and invalid create/list/conclude/remove inputs; run `npm test` and `npm run typecheck`.

- [x] **T008: Add HTTP task routes and integration**
  - **Description:** Wire the approved HTTP surface to the task service for create, list, conclude, and remove while sharing one in-memory store instance.
  - **Dependencies:** T007
  - **Completion criteria:** All four approved operations are reachable through HTTP, use the same task state, preserve casing, apply filters, and expose the same outcomes as the service contract.
  - **Tests:** Add HTTP integration tests for success and every specified error outcome, then run `npm test` and `npm run typecheck`.

- [x] **T009: Add HTTP server entrypoint**
  - **Description:** Create `src/index.ts` as the node:http server entrypoint and connect it to the approved routes and shared task store/service.
  - **Dependencies:** T008
  - **Completion criteria:** `npm run dev` starts the server, HTTP operations can run end to end, and the entrypoint performs no business-rule implementation outside the service.
  - **Tests:** Add an entrypoint startup/health integration check where practical; run `npm test`, `npm run typecheck`, and manually exercise at least one success and one failure flow through the running server.

- [x] **T010: Implement and test the CLI boundary**
  - **Description:** Add the CLI commands approved in Review Gate 001, using Zod for arguments and the same service/store instance behind the command process.
  - **Dependencies:** Review Gate 001, T006
  - **Completion criteria:** CLI create, list with optional filter, conclude, and remove commands produce success and clear failure output consistent with HTTP and domain rules.
  - **Tests:** Add node:test cases or subprocess tests for valid operations, blank/duplicate/not-found failures, filters, and case-insensitive title lookup; run `npm test`, `npm run typecheck`, and manually run representative CLI success/failure commands.

- [x] **T011: Integrate CLI entrypoint and shared behavior**
  - **Description:** Wire `src/cli.ts` to the CLI boundary and an in-memory store/service so it is runnable through the project command.
  - **Dependencies:** T010
  - **Completion criteria:** `npm run cli -- <approved arguments>` supports create, list, conclude, and remove without bypassing service/store boundaries; process output and exit behavior clearly reflect success or failure.
  - **Tests:** Run subprocess-based CLI tests for every operation and representative validation/domain failures; run full `npm test` and `npm run typecheck`.

- [x] **T012: Add cross-boundary consistency coverage and final verification**
  - **Description:** Add focused integration coverage proving HTTP and CLI expose the same task rules and outcomes through the shared service, without persistence assumptions crossing process boundaries.
  - **Dependencies:** T009, T011
  - **Completion criteria:** HTTP and CLI have automated or documented equivalent coverage for create/list/conclude/remove and major failures; project documentation is updated only with approved interface syntax, and no secrets or unsupported `.env` usage are introduced.
  - **Tests:** Run the complete `npm test` suite and `npm run typecheck`; manually smoke-test HTTP and CLI create/list/conclude/remove plus whitespace, duplicate, and missing-title cases.
