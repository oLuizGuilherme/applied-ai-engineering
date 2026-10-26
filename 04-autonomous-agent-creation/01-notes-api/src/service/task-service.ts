import {
  TaskAlreadyExistsError,
  TaskNotFoundError,
  TaskValidationError,
} from "../domain/errors.js";
import {
  TaskFilterSchema,
  TaskTitleInputSchema,
  type Task,
  type TaskFilter,
} from "../domain/task.js";
import type { TaskStore } from "../store/task-store.js";

export function createTask(store: TaskStore, title: string): Task {
  const parsed = TaskTitleInputSchema.safeParse(title);
  if (!parsed.success) {
    throw new TaskValidationError();
  }

  const normalizedTitle = parsed.data;
  if (store.findByTitle(normalizedTitle)) {
    throw new TaskAlreadyExistsError(normalizedTitle);
  }

  const created = store.create({ title: normalizedTitle, done: false });
  if (!created) {
    throw new TaskAlreadyExistsError(normalizedTitle);
  }
  return created;
}

export function listTasks(store: TaskStore, filter: TaskFilter = "all"): readonly Task[] {
  const parsed = TaskFilterSchema.safeParse(filter);
  if (!parsed.success) {
    return store.list("all");
  }
  return store.list(parsed.data);
}

export function concludeTask(store: TaskStore, title: string): Task {
  const parsed = TaskTitleInputSchema.safeParse(title);
  if (!parsed.success) {
    throw new TaskValidationError();
  }

  const normalizedTitle = parsed.data;
  const concluded = store.conclude(normalizedTitle);
  if (!concluded) {
    throw new TaskNotFoundError(normalizedTitle);
  }
  return concluded;
}

export function removeTask(store: TaskStore, title: string): void {
  const parsed = TaskTitleInputSchema.safeParse(title);
  if (!parsed.success) {
    throw new TaskValidationError();
  }

  const normalizedTitle = parsed.data;
  const removed = store.remove(normalizedTitle);
  if (!removed) {
    throw new TaskNotFoundError(normalizedTitle);
  }
}
