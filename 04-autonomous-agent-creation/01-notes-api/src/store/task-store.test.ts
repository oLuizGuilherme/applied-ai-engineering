import assert from "node:assert/strict";
import test from "node:test";

import type { Task } from "../domain/task.js";
import {
  normalizeTaskTitle,
  type TaskStore,
} from "./task-store.js";

class ContractTaskStore implements TaskStore {
  readonly tasks = new Map<string, Task>();

  create(task: Task): Task | undefined {
    const key = normalizeTaskTitle(task.title);
    if (this.tasks.has(key)) {
      return undefined;
    }
    this.tasks.set(key, task);
    return task;
  }

  list(filter?: "all" | "open" | "done"): readonly Task[] {
    const tasks = [...this.tasks.values()];
    if (filter === "open") {
      return tasks.filter((task) => !task.done);
    }
    if (filter === "done") {
      return tasks.filter((task) => task.done);
    }
    return tasks;
  }

  findByTitle(title: string): Task | undefined {
    return this.tasks.get(normalizeTaskTitle(title));
  }

  conclude(title: string): Task | undefined {
    const task = this.findByTitle(title);
    if (!task) {
      return undefined;
    }
    task.done = true;
    return task;
  }

  remove(title: string): boolean {
    return this.tasks.delete(normalizeTaskTitle(title));
  }
}

test("TaskStore contract supports create, list, conclude, and remove", () => {
  const store: TaskStore = new ContractTaskStore();
  const created = store.create({ title: "Write tests", done: false });

  assert.deepEqual(created, { title: "Write tests", done: false });
  assert.deepEqual(store.list(), [{ title: "Write tests", done: false }]);
  assert.deepEqual(store.list("open"), [{ title: "Write tests", done: false }]);
  assert.deepEqual(store.conclude("WRITE TESTS"), {
    title: "Write tests",
    done: true,
  });
  assert.deepEqual(store.list("done"), [{ title: "Write tests", done: true }]);
  assert.equal(store.remove("write tests"), true);
  assert.deepEqual(store.list(), []);
});

test("normalizeTaskTitle trims and compares titles case-insensitively", () => {
  assert.equal(normalizeTaskTitle("  Write Tests  "), "write tests");
});

test("findByTitle returns undefined for a missing task", () => {
  const store: TaskStore = new ContractTaskStore();
  assert.equal(store.findByTitle("Missing task"), undefined);
});
