import assert from "node:assert/strict";
import test from "node:test";

import {
  TaskAlreadyExistsError,
  TaskNotFoundError,
  TaskValidationError,
} from "../domain/errors.js";
import { InMemoryTaskStore } from "../store/in-memory-task-store.js";
import {
  concludeTask,
  createTask,
  listTasks,
  removeTask,
} from "./task-service.js";

test("createTask trims titles, preserves casing, and starts tasks open", () => {
  const store = new InMemoryTaskStore();

  assert.deepEqual(createTask(store, "  Write Tests  "), {
    title: "Write Tests",
    done: false,
  });
});

test("createTask rejects blank titles with TaskValidationError", () => {
  const store = new InMemoryTaskStore();

  assert.throws(() => createTask(store, " \t\n "), TaskValidationError);
});

test("createTask rejects duplicate titles regardless of case", () => {
  const store = new InMemoryTaskStore();
  createTask(store, "Write Tests");

  assert.throws(
    () => createTask(store, "  write tests  "),
    TaskAlreadyExistsError,
  );
});

test("listTasks returns all, open, and done tasks", () => {
  const store = new InMemoryTaskStore();
  createTask(store, "Open task");
  createTask(store, "Done task");
  concludeTask(store, "done task");

  assert.equal(listTasks(store).length, 2);
  assert.deepEqual(listTasks(store, "open").map((task) => task.title), [
    "Open task",
  ]);
  assert.deepEqual(listTasks(store, "done").map((task) => task.title), [
    "Done task",
  ]);
});

test("concludeTask marks an open or already done task done case-insensitively", () => {
  const store = new InMemoryTaskStore();
  createTask(store, "Write Tests");

  assert.deepEqual(concludeTask(store, "WRITE tests"), {
    title: "Write Tests",
    done: true,
  });
  assert.deepEqual(concludeTask(store, "write TESTS"), {
    title: "Write Tests",
    done: true,
  });
});

test("concludeTask rejects missing titles", () => {
  const store = new InMemoryTaskStore();

  assert.throws(() => concludeTask(store, "Missing task"), TaskNotFoundError);
});

test("removeTask removes a task case-insensitively", () => {
  const store = new InMemoryTaskStore();
  createTask(store, "Write Tests");

  removeTask(store, "WRITE TESTS");
  assert.deepEqual(listTasks(store), []);
});

test("removeTask rejects missing titles", () => {
  const store = new InMemoryTaskStore();

  assert.throws(() => removeTask(store, "Missing task"), TaskNotFoundError);
});

test("concludeTask and removeTask reject blank titles", () => {
  const store = new InMemoryTaskStore();

  assert.throws(() => concludeTask(store, "  "), TaskValidationError);
  assert.throws(() => removeTask(store, "  "), TaskValidationError);
});
