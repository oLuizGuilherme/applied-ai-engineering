# Plan 001: Task Management Feature

## Problem and approach

The project needs task-management functionality that allows users to create, list, conclude, and remove tasks by title. This plan follows the repository constitution and preserves the dependency flow `http/cli -> service -> store`, while keeping domain logic free from I/O. The implementation will validate external inputs with Zod, represent predictable failures as domain errors, and cover the behavior with focused tests.

## Architecture

- `src/domain/`
  - Define the task domain model and shared validation contracts.
  - Responsibilities: task shape, title normalization rules, and reusable Zod schemas.
  - No I/O should happen here.

- `src/store/`
  - Provide a task store interface and an in-memory implementation.
  - Responsibilities: persisting task records, checking case-insensitive uniqueness, and supporting create/list/conclude/remove operations.

- `src/service/`
  - Implement business logic for task rules.
  - Responsibilities: trim and validate titles, enforce uniqueness and not-found rules, and filter all/open/done tasks consistently.
  - Translate the rules into domain errors that the boundaries can report cleanly.

- `src/http/` and `src/cli.ts`
  - Add thin adapters that parse arguments and request data, call the service layer, and convert domain errors into user-facing failures.
  - These boundary layers should not duplicate business logic.

## Data model

- `Task`
  - `title: string` — trimmed title preserving original casing.
  - `done: boolean` — whether the task is complete.

- Proposed Zod schemas
  - `TaskTitleInputSchema`: trims whitespace and requires at least one non-whitespace character.
  - `TaskCreateRequestSchema`: a boundary schema that accepts a `title` and validates it.
  - `TaskFilterSchema`: accepts `all`, `open`, or `done` values at the boundary.
  - `TaskLookupSchema`: validates the title used for conclude/remove operations.

- Domain errors
  - `TaskValidationError`: blank or whitespace-only title.
  - `TaskAlreadyExistsError`: duplicate title ignoring case.
  - `TaskNotFoundError`: no matching task found for conclude/remove.

## Contracts

The specification leaves HTTP route syntax and CLI command syntax intentionally unspecified. This plan therefore focuses on behavior and outcomes instead of inventing unsupported interfaces.

- HTTP contract
  - The HTTP boundary should expose the same create/list/conclude/remove capabilities as the CLI.
  - It should validate input before service calls and return consistent result/error semantics.

- CLI contract
  - The CLI should support task creation, list filtering, conclusion by title, and removal by title.
  - It must use the same title normalization and uniqueness rules as HTTP.

## Decisions and trade-offs

- Case-insensitive uniqueness with preserved display casing
  - Decision: compare titles using a normalized lowercase/trimmed key while storing the original trimmed title.
  - Trade-off: prevents duplicates without discarding user-entered formatting.

- In-memory store
  - Decision: use an in-memory store behind a task interface for this feature.
  - Trade-off: simple and fast, but not persistent across process restarts.

- Domain errors at the service layer
  - Decision: service code throws domain errors and the boundaries translate them into user-facing messages.
  - Trade-off: keeps business rules central and prevents duplication.

## Test strategy

Use the existing `node:test` runner via `tsx`, with focused tests on behavior required by the specification.

- Service tests
  - create a task with a trimmed title and preserved casing.
  - reject blank/whitespace-only titles.
  - reject duplicate titles ignoring case.
  - list all, open, and done tasks correctly.
  - conclude a task by title regardless of its existing state.
  - remove a task by title and ensure it is absent from later lists.
  - return not-found errors when concluding/removing missing titles.

- Boundary tests
  - verify HTTP validation/error translation.
  - verify CLI success and failure flows.
  - ensure both interfaces use the same business rules.

- Validation step
  - run the project’s tests and `tsc --noEmit` after implementation.

## Risks and human review

- Route naming and CLI syntax are intentionally unspecified in the spec, so the final HTTP/CLI surface should be reviewed against repo conventions before implementation is finalized.
- The title normalization behavior is sensitive: trim surrounding whitespace, preserve original casing, and compare uniqueness case-insensitively.
- The main risk is drift between HTTP and CLI call paths if they are implemented separately without a shared service contract.

## Spec ID

001
