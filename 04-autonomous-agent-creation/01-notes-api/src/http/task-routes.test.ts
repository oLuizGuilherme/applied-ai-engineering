import assert from "node:assert/strict";
import type { IncomingMessage, ServerResponse } from "node:http";
import test from "node:test";

import { InMemoryTaskStore } from "../store/in-memory-task-store.js";
import { createTaskRequestHandler } from "./task-routes.js";

async function invoke(handler: ReturnType<typeof createTaskRequestHandler>, input: {
  method: string;
  url: string;
  body?: unknown;
}) {
  let status = 200;
  let bodyText = "";
  let contentType = "";
  const request = {
    method: input.method,
    url: input.url,
    async *[Symbol.asyncIterator]() {
      if (input.body !== undefined) {
        yield Buffer.from(JSON.stringify(input.body));
      }
    },
  } as IncomingMessage;
  const response = {
    set statusCode(value: number) { status = value; },
    get statusCode() { return status; },
    setHeader(name: string, value: string) { if (name === "content-type") contentType = value; },
    end(value?: string | Uint8Array) { bodyText = typeof value === "string" ? value : ""; },
  } as ServerResponse;

  await handler(request, response);
  return { status, body: bodyText ? JSON.parse(bodyText) as unknown : undefined, contentType };
}

test("task HTTP routes support create, list, conclude, and remove", async () => {
  const store = new InMemoryTaskStore();
  const handler = createTaskRequestHandler(store);

  const created = await invoke(handler, {
    method: "POST",
    url: "/tasks",
    body: { title: "  Write Tests  " },
  });
  assert.equal(created.status, 201);
  assert.deepEqual(created.body, { title: "Write Tests", done: false });

  const listed = await invoke(handler, { method: "GET", url: "/tasks?filter=open" });
  assert.equal(listed.status, 200);
  assert.deepEqual(listed.body, [{ title: "Write Tests", done: false }]);

  const concluded = await invoke(handler, {
    method: "PATCH",
    url: "/tasks/write%20tests/conclude",
  });
  assert.equal(concluded.status, 200);
  assert.deepEqual(concluded.body, { title: "Write Tests", done: true });

  const removed = await invoke(handler, {
    method: "DELETE",
    url: "/tasks/WRITE%20TESTS",
  });
  assert.equal(removed.status, 204);
  assert.equal(removed.body, undefined);
});

test("task HTTP routes translate validation, duplicate, and not-found failures", async () => {
  const store = new InMemoryTaskStore();
  const handler = createTaskRequestHandler(store);

  const blank = await invoke(handler, {
    method: "POST",
    url: "/tasks",
    body: { title: "   " },
  });
  assert.equal(blank.status, 400);

  await invoke(handler, {
    method: "POST",
    url: "/tasks",
    body: { title: "Write tests" },
  });
  const duplicate = await invoke(handler, {
    method: "POST",
    url: "/tasks",
    body: { title: "write TESTS" },
  });
  assert.equal(duplicate.status, 409);

  const missing = await invoke(handler, {
    method: "DELETE",
    url: "/tasks/missing",
  });
  assert.equal(missing.status, 404);
});

test("task HTTP routes reject invalid filters and malformed JSON", async () => {
  const store = new InMemoryTaskStore();
  const handler = createTaskRequestHandler(store);

  const filter = await invoke(handler, {
    method: "GET",
    url: "/tasks?filter=pending",
  });
  assert.equal(filter.status, 400);

  const request = {
    method: "POST",
    url: "/tasks",
    async *[Symbol.asyncIterator]() { yield Buffer.from("{"); },
  } as IncomingMessage;
  let status = 200;
  const response = {
    set statusCode(value: number) { status = value; },
    get statusCode() { return status; },
    setHeader() {},
    end() {},
  } as unknown as ServerResponse;
  await handler(request, response);
  assert.equal(status, 400);
});
