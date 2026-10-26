import assert from "node:assert/strict";
import test from "node:test";

import { runTaskCli } from "./cli.js";
import {
  TaskStorageParseError,
  TaskStorageValidationError,
  TaskStorageWriteError,
} from "./domain/errors.js";
import { InMemoryTaskStore } from "./store/in-memory-task-store.js";

test("CLI create, list, conclude, and remove use shared task state", () => {
  const store = new InMemoryTaskStore();

  assert.equal(runTaskCli(["create", "Write", "tests"], store).exitCode, 0);
  assert.deepEqual(JSON.parse(runTaskCli(["list", "--filter", "open"], store).output), [
    { title: "Write tests", done: false },
  ]);
  assert.equal(runTaskCli(["conclude", "write", "TESTS"], store).exitCode, 0);
  assert.deepEqual(JSON.parse(runTaskCli(["list", "--filter", "done"], store).output), [
    { title: "Write tests", done: true },
  ]);
  assert.equal(runTaskCli(["remove", "WRITE", "TESTS"], store).exitCode, 0);
  assert.deepEqual(JSON.parse(runTaskCli(["list"], store).output), []);
});

test("CLI reports validation, duplicate, not-found, and filter failures", () => {
  const store = new InMemoryTaskStore();

  assert.equal(runTaskCli(["create", "   "], store).exitCode, 1);
  assert.equal(runTaskCli(["create", "Write", "tests"], store).exitCode, 0);
  assert.equal(runTaskCli(["create", "write", "TESTS"], store).exitCode, 1);
  assert.equal(runTaskCli(["conclude", "Missing"], store).exitCode, 1);
  assert.equal(runTaskCli(["remove", "Missing"], store).exitCode, 1);
  assert.equal(runTaskCli(["list", "--filter", "pending"], store).exitCode, 1);
});

test("CLI rejects unknown commands", () => {
  assert.equal(runTaskCli(["unknown"], new InMemoryTaskStore()).exitCode, 1);
});

test("CLI reports storage domain failures distinctly", () => {
  assert.equal(TaskStorageParseError.name, "TaskStorageParseError");
  assert.equal(TaskStorageValidationError.name, "TaskStorageValidationError");
  assert.equal(TaskStorageWriteError.name, "TaskStorageWriteError");
});
