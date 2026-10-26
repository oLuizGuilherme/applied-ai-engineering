import assert from "node:assert/strict";
import test from "node:test";

import { InMemoryTaskStore } from "./in-memory-task-store.js";

test("InMemoryTaskStore creates open tasks and preserves title casing", () => {
  const store = new InMemoryTaskStore();
  const created = store.create({ title: "Write Tests", done: false });

  assert.deepEqual(created, { title: "Write Tests", done: false });
  assert.deepEqual(store.list(), [{ title: "Write Tests", done: false }]);
});

test("InMemoryTaskStore rejects duplicate titles without regard to case", () => {
  const store = new InMemoryTaskStore();

  assert.deepEqual(store.create({ title: "Write Tests", done: false }), {
    title: "Write Tests",
    done: false,
  });
  assert.equal(store.create({ title: "  write tests  ", done: false }), undefined);
  assert.deepEqual(store.list(), [{ title: "Write Tests", done: false }]);
});

test("InMemoryTaskStore filters open and done tasks", () => {
  const store = new InMemoryTaskStore();
  store.create({ title: "Open task", done: false });
  store.create({ title: "Done task", done: true });

  assert.deepEqual(store.list("open"), [{ title: "Open task", done: false }]);
  assert.deepEqual(store.list("done"), [{ title: "Done task", done: true }]);
  assert.equal(store.list("all").length, 2);
});

test("InMemoryTaskStore finds tasks case-insensitively", () => {
  const store = new InMemoryTaskStore();
  store.create({ title: "Write Tests", done: false });

  assert.deepEqual(store.findByTitle("  WRITE TESTS  "), {
    title: "Write Tests",
    done: false,
  });
  assert.equal(store.findByTitle("Missing task"), undefined);
});

test("InMemoryTaskStore concludes and removes tasks by title", () => {
  const store = new InMemoryTaskStore();
  store.create({ title: "Write Tests", done: false });

  assert.deepEqual(store.conclude("write tests"), {
    title: "Write Tests",
    done: true,
  });
  assert.equal(store.conclude("Already done"), undefined);
  assert.deepEqual(store.list("done"), [{ title: "Write Tests", done: true }]);
  assert.equal(store.remove("WRITE TESTS"), true);
  assert.equal(store.remove("Write Tests"), false);
  assert.deepEqual(store.list(), []);
});

test("InMemoryTaskStore does not expose its internal task objects", () => {
  const store = new InMemoryTaskStore();
  store.create({ title: "Write Tests", done: false });

  const found = store.findByTitle("Write Tests");
  assert.ok(found);
  found.done = true;

  assert.deepEqual(store.findByTitle("Write Tests"), {
    title: "Write Tests",
    done: false,
  });
});
