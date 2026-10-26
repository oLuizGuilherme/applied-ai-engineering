# CLI JSON Persistence Specification

## Context and problem

CLI task commands currently use process-local in-memory state, so tasks do not
survive when each CLI invocation ends. Users need one JSON-backed state file that
persists task create, conclude, and remove operations across separate CLI
sessions without requiring the user to select or provide a file.

## User stories

- As a CLI user, I want tasks to be stored automatically so that they are
  available in later CLI sessions.
- As a CLI user, I want existing CLI commands to use the same automatically
  persisted task state so that persistence does not change task-management
  behavior.
- As a CLI user, I want a missing task file to start with no tasks so that first
  use is straightforward.
- As a CLI user, I want clear failures for malformed or invalid task state so
  that existing task data is not silently replaced or corrupted.
- As a CLI user, I want create, list, conclude, and remove operations to use the
  same single task file consistently.

## Functional requirements

1. The CLI must automatically use one JSON task file named `tasks.json` in the
   project root.
2. The CLI must not accept a user-provided JSON file path for task persistence.
3. The CLI must load `tasks.json` before processing every task operation.
4. When `tasks.json` does not exist, the CLI must treat its initial task state as
   empty.
5. When a create, conclude, or remove operation succeeds, the CLI must save the
   resulting task state to `tasks.json` before reporting success.
6. When a list operation is successful, the CLI must read current task state
   without changing that state.
7. Persistence operations must preserve all existing task rules, including
   trimmed titles, case-insensitive uniqueness and lookup, preserved display
   casing, new tasks being open, and supported list filters.
8. When `tasks.json` contains malformed JSON or invalid task state, the CLI must
   report a clear persistence failure and must not silently reset or overwrite
   the file.
9. When `tasks.json` cannot be read or written because of filesystem
   restrictions or another I/O error, the CLI must report a clear failure.
10. Failed operations must leave `tasks.json` unchanged.
11. HTTP task operations must remain behaviorally independent from the CLI task
    file and must not use or change `tasks.json`.

## Acceptance criteria

- When a user runs a supported CLI operation, the system must load and persist
  task state in the project-root `tasks.json` automatically.
- When a user creates a task while `tasks.json` is missing, the system must
  create an open task, save it to `tasks.json`, and expose it in later CLI
  sessions.
- When a user lists tasks while `tasks.json` is missing, the system must report
  an empty task list and leave the JSON task state empty.
- When a user concludes or removes a task, the system must save the resulting
  state to `tasks.json` and expose that result in later CLI sessions.
- When a user concludes or removes a missing task, the system must report the
  task-not-found failure and leave the JSON file unchanged.
- When a user creates a blank or duplicate title through the JSON-backed CLI,
  the system must report the existing title-validation or duplicate failure and
  leave the JSON file unchanged.
- When `tasks.json` contains malformed JSON, the system must report a clear
  storage failure and must not overwrite or repair the file.
- When `tasks.json` contains invalid task state, the system must report a clear
  storage failure and must not overwrite it.
- When `tasks.json` cannot be read or written, the system must report a clear
  filesystem failure without claiming the operation succeeded.
- When the JSON-backed operation succeeds, the system must return task outcomes
  and filtering behavior consistent with the existing CLI.

## Out of scope

- Automatic persistence through a mechanism other than the project-root `tasks.json` file.
- Sharing JSON-backed CLI state with the HTTP API.
- Supporting JSON files created by external applications with formats not
  representing the task state.
- Concurrent CLI sessions modifying the same JSON file safely.
- Schema migration between incompatible future JSON task-file formats.
- Secret storage, encryption, or access control for JSON task files.
- A new HTTP route or HTTP persistence mechanism.

## Unanswered questions

- None blocking the specification; the exact JSON task-file representation and
  conflict-handling strategy for concurrent writes will be defined during
  planning or implementation if they become necessary.
