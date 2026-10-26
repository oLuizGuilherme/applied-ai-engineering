import type { Task, TaskFilter } from "../domain/task.js";

export interface TaskStore {
  create(task: Task): Task | undefined;
  list(filter?: TaskFilter): readonly Task[];
  findByTitle(title: string): Task | undefined;
  conclude(title: string): Task | undefined;
  remove(title: string): boolean;
}

export function normalizeTaskTitle(title: string): string {
  return title.trim().toLowerCase();
}
