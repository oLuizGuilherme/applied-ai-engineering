import { createServer } from "node:http";
import { fileURLToPath } from "node:url";

import { createTaskRequestHandler } from "./http/task-routes.js";
import { InMemoryTaskStore } from "./store/in-memory-task-store.js";

export function createTaskServer(port = 3000) {
  const store = new InMemoryTaskStore();
  const handler = createTaskRequestHandler(store);
  return createServer((request, response) => {
    void handler(request, response);
  }).listen(port);
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  const server = createTaskServer(3000);
  console.log("Task API listening on http://localhost:3000");
  void server;
}
