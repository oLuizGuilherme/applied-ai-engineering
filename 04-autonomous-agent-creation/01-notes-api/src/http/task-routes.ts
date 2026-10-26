import type { IncomingMessage, ServerResponse } from "node:http";
import { URL } from "node:url";
import { ZodError } from "zod";

import { concludeTask, createTask, listTasks, removeTask } from "../service/task-service.js";
import type { TaskStore } from "../store/task-store.js";
import {
  parseTaskCreateBody,
  parseTaskFilter,
  parseTaskLookupTitle,
  translateTaskError,
} from "./task-http.js";

async function readJsonBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (chunks.length === 0) {
    return undefined;
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
}

function sendJson(response: ServerResponse, status: number, body: unknown): void {
  response.statusCode = status;
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.end(JSON.stringify(body));
}

export function createTaskRequestHandler(store: TaskStore) {
  return async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
    try {
      const url = new URL(request.url ?? "/", "http://localhost");

      if (request.method === "POST" && url.pathname === "/tasks") {
        const parsed = parseTaskCreateBody(await readJsonBody(request));
        sendJson(response, 201, createTask(store, parsed.title));
        return;
      }

      if (request.method === "GET" && url.pathname === "/tasks") {
        const filter = parseTaskFilter(url.searchParams.get("filter") ?? undefined);
        sendJson(response, 200, listTasks(store, filter));
        return;
      }

      const titleMatch = /^\/tasks\/([^/]+)\/(conclude)$/.exec(url.pathname);
      const removeMatch = /^\/tasks\/([^/]+)$/.exec(url.pathname);

      if (request.method === "PATCH" && titleMatch) {
        const title = parseTaskLookupTitle(decodeURIComponent(titleMatch[1]));
        sendJson(response, 200, concludeTask(store, title));
        return;
      }

      if (request.method === "DELETE" && removeMatch) {
        const title = parseTaskLookupTitle(decodeURIComponent(removeMatch[1]));
        removeTask(store, title);
        sendJson(response, 204, undefined);
        return;
      }

      sendJson(response, 404, { message: "Route not found." });
    } catch (error) {
      if (error instanceof ZodError) {
        sendJson(response, 400, { message: "Invalid request input." });
        return;
      }
      if (error instanceof SyntaxError) {
        sendJson(response, 400, { message: "Invalid JSON body." });
        return;
      }
      const httpError = translateTaskError(error);
      sendJson(response, httpError.status, { message: httpError.message });
    }
  };
}
