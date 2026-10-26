import { randomUUID } from "node:crypto";
import { existsSync, readFileSync, renameSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";

import {
  TaskStorageParseError,
  TaskStorageReadError,
  TaskStorageValidationError,
  TaskStorageWriteError,
} from "../domain/errors.js";
import { PersistedTaskFileSchema, type Task, type TaskFilter } from "../domain/task.js";
import { normalizeTaskTitle, type TaskStore } from "./task-store.js";
import { getTaskFilePath } from "./task-file.js";

export class JsonTaskStore implements TaskStore {
  private tasks = new Map<string, Task>();

  constructor(private readonly filePath = getTaskFilePath()) {
    this.load();
  }

  private load(): void {
    if (!existsSync(this.filePath)) {
      this.tasks = new Map();
      this.write({ tasks: [] });
      return;
    }

    let contents: string;
    try {
      contents = readFileSync(this.filePath, "utf8");
    } catch {
      throw new TaskStorageReadError();
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(contents);
    } catch {
      throw new TaskStorageParseError();
    }

    const result = PersistedTaskFileSchema.safeParse(parsed);
    if (!result.success) {
      throw new TaskStorageValidationError();
    }

    this.tasks = new Map(result.data.tasks.map((task) => [normalizeTaskTitle(task.title), { ...task }]));
  }

  private write(document: { tasks: Task[] }): void {
    const result = PersistedTaskFileSchema.safeParse(document);
    if (!result.success) {
      throw new TaskStorageValidationError();
    }

    const temporaryPath = join(dirname(this.filePath), `.${randomUUID()}.tasks.tmp`);
    try {
      writeFileSync(temporaryPath, `${JSON.stringify(result.data, null, 2)}\n`, { encoding: "utf8", flag: "wx", mode: 0o600 });
      renameSync(temporaryPath, this.filePath);
    } catch {
      try {
        rmSync(temporaryPath, { force: true });
      } catch {}
      throw new TaskStorageWriteError();
    }
  }

  create(task: Task): Task | undefined {
    const key = normalizeTaskTitle(task.title);
    if (this.tasks.has(key)) return undefined;

    const stored = { ...task };
    this.tasks.set(key, stored);
    try {
      this.write({ tasks: [...this.tasks.values()] });
      return { ...stored };
    } catch (error) {
      this.tasks.delete(key);
      throw error;
    }
  }

  list(filter: TaskFilter = "all"): readonly Task[] {
    const tasks = [...this.tasks.values()].map((task) => ({ ...task }));
    if (filter === "open") return tasks.filter((task) => !task.done);
    if (filter === "done") return tasks.filter((task) => task.done);
    return tasks;
  }

  findByTitle(title: string): Task | undefined {
    const task = this.tasks.get(normalizeTaskTitle(title));
    return task ? { ...task } : undefined;
  }

  conclude(title: string): Task | undefined {
    const key = normalizeTaskTitle(title);
    const task = this.tasks.get(key);
    if (!task) return undefined;

    const previousDone = task.done;
    task.done = true;
    try {
      this.write({ tasks: [...this.tasks.values()] });
    } catch (error) {
      task.done = previousDone;
      throw error;
    }
    return { ...task };
  }

  remove(title: string): boolean {
    const key = normalizeTaskTitle(title);
    if (!this.tasks.has(key)) return false;

    const removed = this.tasks.get(key);
    this.tasks.delete(key);
    try {
      this.write({ tasks: [...this.tasks.values()] });
      return true;
    } catch (error) {
      if (removed) this.tasks.set(key, removed);
      throw error;
    }
  }
}
