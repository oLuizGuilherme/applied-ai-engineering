# notes-api

A Node.js project scaffold for a notes API, written in TypeScript and configured
to use ECMAScript modules. The application source has not been added yet.

## Prerequisites

- Node.js 24 or later
- npm

Check that they are available:

```sh
node --version
npm --version
```

## Initialize

From the repository root, change to the project directory and install its
dependencies:

```sh
cd 04-autonomous-agent-creation/01-notes-api
npm install
```

## Available commands

Run these commands from the project directory:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the development entrypoint with `tsx` (`src/index.ts`). |
| `npm run cli` | Run the CLI entrypoint with `tsx` (`src/cli.ts`). |
| `npm test` | Run Node's test runner with `tsx` for TypeScript tests under `src/`. |
| `npm run typecheck` | Type-check the TypeScript files without emitting output. |

## Task management

The HTTP API provides task operations through `node:http`:

- `POST /tasks` with JSON `{ "title": "Write tests" }` creates a task.
- `GET /tasks?filter=all|open|done` lists tasks; omission defaults to `all`.
- `PATCH /tasks/:title/conclude` concludes a task by title.
- `DELETE /tasks/:title` removes a task by title.

The CLI uses the same task rules:

```sh
npm run cli -- create "Write tests"
npm run cli -- list
npm run cli -- list --filter open
npm run cli -- conclude "Write tests"
npm run cli -- remove "Write tests"
```

The HTTP server uses in-memory task state and is reset when the server exits.

The CLI automatically loads and saves tasks in the project-root `tasks.json` file. It does not accept a user-provided file path. The first CLI operation creates the file with an empty task list, and later create, list, conclude, and remove operations use the same state across CLI processes. Malformed JSON or invalid task state produces a CLI error and is not overwritten.

## Dependencies

- [Zod](https://zod.dev/) for schema validation.
- TypeScript, `tsx`, and Node.js type definitions for development.
