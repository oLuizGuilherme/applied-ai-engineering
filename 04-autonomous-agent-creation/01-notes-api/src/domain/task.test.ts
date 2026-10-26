import assert from "node:assert/strict";
import test from "node:test";

import {
  TaskCreateRequestSchema,
  TaskFilterSchema,
  TaskLookupSchema,
  TaskTitleInputSchema,
  PersistedTaskFileSchema,
  PersistedTaskSchema,
  type Task,
} from "./task.js";

test("TaskTitleInputSchema trims surrounding whitespace", () => {
  assert.equal(TaskTitleInputSchema.parse("  Write tests  "), "Write tests");
});

test("TaskTitleInputSchema rejects whitespace-only titles", () => {
  assert.equal(TaskTitleInputSchema.safeParse(" \t\n ").success, false);
});

test("TaskCreateRequestSchema and TaskLookupSchema validate task titles", () => {
  assert.deepEqual(TaskCreateRequestSchema.parse({ title: "  Review  " }), {
    title: "Review",
  });
  assert.deepEqual(TaskLookupSchema.parse({ title: "  Review  " }), {
    title: "Review",
  });
});

test("TaskFilterSchema accepts all supported task filters", () => {
  assert.equal(TaskFilterSchema.parse("all"), "all");
  assert.equal(TaskFilterSchema.parse("open"), "open");
  assert.equal(TaskFilterSchema.parse("done"), "done");
  assert.equal(TaskFilterSchema.safeParse("pending").success, false);
});

test("Task exposes the required title and completion fields", () => {
  const task: Task = { title: "Write tests", done: false };
  assert.deepEqual(task, { title: "Write tests", done: false });
});

test("PersistedTaskSchema validates and trims persisted tasks", () => {
  assert.deepEqual(PersistedTaskSchema.parse({ title: "  Write tests  ", done: false }), {
    title: "Write tests",
    done: false,
  });
  assert.equal(PersistedTaskSchema.safeParse({ title: "   ", done: false }).success, false);
  assert.equal(PersistedTaskSchema.safeParse({ title: "Write tests", done: "false" }).success, false);
  assert.equal(PersistedTaskSchema.safeParse({ title: "Write tests", done: false, extra: true }).success, false);
});

test("PersistedTaskFileSchema validates the persisted task document", () => {
  assert.deepEqual(PersistedTaskFileSchema.parse({
    tasks: [{ title: "Write tests", done: false }],
  }), { tasks: [{ title: "Write tests", done: false }] });
  assert.equal(PersistedTaskFileSchema.safeParse(null).success, false);
  assert.equal(PersistedTaskFileSchema.safeParse([]).success, false);
  assert.equal(PersistedTaskFileSchema.safeParse({ tasks: [], extra: true }).success, false);
});

test("PersistedTaskFileSchema rejects duplicate titles without regard to case", () => {
  const result = PersistedTaskFileSchema.safeParse({
    tasks: [
      { title: "Write tests", done: false },
      { title: "  WRITE TESTS  ", done: true },
    ],
  });

  assert.equal(result.success, false);
});
