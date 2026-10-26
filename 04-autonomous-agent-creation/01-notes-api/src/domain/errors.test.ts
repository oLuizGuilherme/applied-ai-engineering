import assert from "node:assert/strict";
import test from "node:test";

import {
  TaskAlreadyExistsError,
  TaskNotFoundError,
  TaskStorageParseError,
  TaskStorageReadError,
  TaskStorageValidationError,
  TaskStorageWriteError,
  TaskValidationError,
} from "./errors.js";

test("TaskValidationError has a stable name and clear default message", () => {
  const error = new TaskValidationError();

  assert.ok(error instanceof Error);
  assert.equal(error.name, "TaskValidationError");
  assert.equal(
    error.message,
    "Task title must contain at least one non-whitespace character.",
  );
});

test("TaskAlreadyExistsError identifies the duplicate title", () => {
  const error = new TaskAlreadyExistsError("Write tests");

  assert.ok(error instanceof Error);
  assert.equal(error.name, "TaskAlreadyExistsError");
  assert.equal(error.message, 'A task titled "Write tests" already exists.');
});

test("TaskNotFoundError identifies the missing title", () => {
  const error = new TaskNotFoundError("Missing task");

  assert.ok(error instanceof Error);
  assert.equal(error.name, "TaskNotFoundError");
  assert.equal(error.message, 'No task titled "Missing task" was found.');
});

test("TaskStorageReadError has a stable type and message", () => {
  const error = new TaskStorageReadError();

  assert.ok(error instanceof Error);
  assert.equal(error.name, "TaskStorageReadError");
  assert.equal(error.message, "Could not read the task storage file.");
});

test("TaskStorageParseError has a stable type and message", () => {
  const error = new TaskStorageParseError();

  assert.ok(error instanceof Error);
  assert.equal(error.name, "TaskStorageParseError");
  assert.equal(error.message, "The task storage file contains malformed JSON.");
});

test("TaskStorageValidationError has a stable type and message", () => {
  const error = new TaskStorageValidationError();

  assert.ok(error instanceof Error);
  assert.equal(error.name, "TaskStorageValidationError");
  assert.equal(error.message, "The task storage file contains invalid task state.");
});

test("TaskStorageWriteError has a stable type and message", () => {
  const error = new TaskStorageWriteError();

  assert.ok(error instanceof Error);
  assert.equal(error.name, "TaskStorageWriteError");
  assert.equal(error.message, "Could not write the task storage file.");
});
