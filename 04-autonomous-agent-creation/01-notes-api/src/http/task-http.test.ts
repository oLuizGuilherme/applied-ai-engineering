import assert from "node:assert/strict";
import test from "node:test";

import {
  TaskAlreadyExistsError,
  TaskNotFoundError,
  TaskValidationError,
} from "../domain/errors.js";
import {
  parseTaskCreateBody,
  parseTaskFilter,
  parseTaskLookupBody,
  parseTaskLookupTitle,
  translateTaskError,
} from "./task-http.js";

test("parseTaskCreateBody validates and trims task titles", () => {
  assert.deepEqual(parseTaskCreateBody({ title: "  Write tests  " }), {
    title: "Write tests",
  });
  assert.throws(() => parseTaskCreateBody({ title: "   " }));
});

test("parseTaskLookupBody and title validate task lookups", () => {
  assert.deepEqual(parseTaskLookupBody({ title: "  Review  " }), {
    title: "Review",
  });
  assert.equal(parseTaskLookupTitle("  Review  "), "Review");
  assert.throws(() => parseTaskLookupTitle("   "));
});

test("parseTaskFilter defaults to all and rejects unknown filters", () => {
  assert.equal(parseTaskFilter(undefined), "all");
  assert.equal(parseTaskFilter("open"), "open");
  assert.equal(parseTaskFilter("done"), "done");
  assert.throws(() => parseTaskFilter("pending"));
});

test("translateTaskError maps validation failures to HTTP semantics", () => {
  assert.deepEqual(
    translateTaskError(new TaskValidationError()),
    {
      status: 400,
      message: "Task title must contain at least one non-whitespace character.",
    },
  );
});

test("translateTaskError maps duplicate titles to conflict", () => {
  assert.deepEqual(
    translateTaskError(new TaskAlreadyExistsError("Write tests")),
    {
      status: 409,
      message: 'A task titled "Write tests" already exists.',
    },
  );
});

test("translateTaskError maps missing tasks to not found", () => {
  assert.deepEqual(
    translateTaskError(new TaskNotFoundError("Missing task")),
    {
      status: 404,
      message: 'No task titled "Missing task" was found.',
    },
  );
});

test("translateTaskError maps unknown failures to internal server error", () => {
  assert.deepEqual(translateTaskError(new Error("unexpected")), {
    status: 500,
    message: "Internal server error.",
  });
});
