import {
  TaskAlreadyExistsError,
  TaskNotFoundError,
  TaskValidationError,
} from "../domain/errors.js";
import {
  TaskCreateRequestSchema,
  TaskFilterSchema,
  TaskLookupSchema,
  type TaskCreateRequest,
  type TaskFilter,
  type TaskLookup,
} from "../domain/task.js";

export interface HttpErrorResponse {
  status: 400 | 404 | 409 | 500;
  message: string;
}

export function parseTaskCreateBody(body: unknown): TaskCreateRequest {
  return TaskCreateRequestSchema.parse(body);
}

export function parseTaskLookupBody(body: unknown): TaskLookup {
  return TaskLookupSchema.parse(body);
}

export function parseTaskLookupTitle(title: unknown): string {
  return TaskLookupSchema.shape.title.parse(title);
}

export function parseTaskFilter(value: unknown): TaskFilter {
  if (value === undefined) {
    return "all";
  }
  return TaskFilterSchema.parse(value);
}

export function translateTaskError(error: unknown): HttpErrorResponse {
  if (error instanceof TaskValidationError) {
    return { status: 400, message: error.message };
  }
  if (error instanceof TaskAlreadyExistsError) {
    return { status: 409, message: error.message };
  }
  if (error instanceof TaskNotFoundError) {
    return { status: 404, message: error.message };
  }
  return { status: 500, message: "Internal server error." };
}
