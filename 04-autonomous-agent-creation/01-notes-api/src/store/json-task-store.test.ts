import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  TaskStorageParseError,
  TaskStorageValidationError,
} from "../domain/errors.js";
import { JsonTaskStore } from "./json-task-store.js";

function temporaryFile(t: { after: (fn: () => void) => void }) {
  const directory = mkdtempSync(join(tmpdir(), "json-task-store-"));
  const filePath = join(directory, "tasks.json");
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  return filePath;
}

test("JsonTaskStore initializes a missing file with an empty task document", (t) => {
  const filePath = temporaryFile(t);
  const store = new JsonTaskStore(filePath);

  assert.deepEqual(store.list(), []);
  assert.deepEqual(JSON.parse(readFileSync(filePath, "utf8")), { tasks: [] });
});

test("JsonTaskStore persists create, filter, conclude, and remove across instances", (t) => {
  const filePath = temporaryFile(t);
  const first = new JsonTaskStore(filePath);

  assert.deepEqual(first.create({ title: "Write Tests", done: false }), {
    title: "Write Tests",
    done: false,
  });
  first.create({ title: "Review code", done: false });

  const second = new JsonTaskStore(filePath);
  assert.deepEqual(second.list("open").map((task) => task.title), ["Write Tests", "Review code"]);
  assert.equal(second.create({ title: "write tests", done: false }), undefined);
  assert.deepEqual(second.conclude("WRITE TESTS"), { title: "Write Tests", done: true });
  assert.deepEqual(second.list("done"), [{ title: "Write Tests", done: true }]);
  assert.equal(second.remove("review code"), true);

  const third = new JsonTaskStore(filePath);
  assert.deepEqual(third.list(), [{ title: "Write Tests", done: true }]);
});

test("JsonTaskStore rejects malformed JSON without rewriting it", (t) => {
  const filePath = temporaryFile(t);
  writeFileSync(filePath, "{ malformed", "utf8");

  assert.throws(() => new JsonTaskStore(filePath), TaskStorageParseError);
  assert.equal(readFileSync(filePath, "utf8"), "{ malformed");
});

test("JsonTaskStore rejects invalid task documents without rewriting them", (t) => {
  const filePath = temporaryFile(t);
  const contents = JSON.stringify({ tasks: [{ title: " ", done: false }] });
  writeFileSync(filePath, contents, "utf8");

  assert.throws(() => new JsonTaskStore(filePath), TaskStorageValidationError);
  assert.equal(readFileSync(filePath, "utf8"), contents);
});

test("JsonTaskStore rejects duplicate persisted titles without rewriting them", (t) => {
  const filePath = temporaryFile(t);
  const contents = JSON.stringify({ tasks: [
    { title: "Write tests", done: false },
    { title: "WRITE TESTS", done: true },
  ] });
  writeFileSync(filePath, contents, "utf8");

  assert.throws(() => new JsonTaskStore(filePath), TaskStorageValidationError);
  assert.equal(readFileSync(filePath, "utf8"), contents);
});
