import type { Task, TaskFilter } from "../domain/task.js";
import {
  normalizeTaskTitle,
  type TaskStore,
} from "./task-store.js";

export class InMemoryTaskStore implements TaskStore {
  private readonly tasks = new Map<string, Task>();

  create(task: Task): Task | undefined {
    const key = normalizeTaskTitle(task.title);
    if (this.tasks.has(key)) {
      return undefined;
    }

    const storedTask = { ...task };
    this.tasks.set(key, storedTask);
    return { ...storedTask };
  }

  list(filter: TaskFilter = "all"): readonly Task[] {
    const tasks = [...this.tasks.values()].map((task) => ({ ...task }));

    if (filter === "open") {
      return tasks.filter((task) => !task.done);
    }
    if (filter === "done") {
      return tasks.filter((task) => task.done);
    }
    return tasks;
  }

  findByTitle(title: string): Task | undefined {
    const task = this.tasks.get(normalizeTaskTitle(title));
    return task ? { ...task } : undefined;
  }

  conclude(title: string): Task | undefined {
    const key = normalizeTaskTitle(title);
    const task = this.tasks.get(key);
    if (!task) {
      return undefined;
    }

    task.done = true;
    return { ...task };
  }

  remove(title: string): boolean {
    return this.tasks.delete(normalizeTaskTitle(title));
  }
}
