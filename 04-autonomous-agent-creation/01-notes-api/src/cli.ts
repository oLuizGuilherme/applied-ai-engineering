import { fileURLToPath } from "node:url";

import {
  TaskStorageParseError,
  TaskStorageReadError,
  TaskStorageValidationError,
  TaskStorageWriteError,
} from "./domain/errors.js";
import { TaskFilterSchema } from "./domain/task.js";
import {
  concludeTask,
  createTask,
  listTasks,
  removeTask,
} from "./service/task-service.js";
import { JsonTaskStore } from "./store/json-task-store.js";
import { InMemoryTaskStore } from "./store/in-memory-task-store.js";

export function runTaskCli(args: readonly string[], store?: InMemoryTaskStore | JsonTaskStore) {
  const taskStore = store ?? new JsonTaskStore();
  const [command, ...rest] = args;

  try {
    switch (command) {
      case "create": {
        const title = rest.join(" ").trim();
        return { exitCode: 0, output: JSON.stringify(createTask(taskStore, title)) };
      }
      case "list": {
        const filterIndex = rest.indexOf("--filter");
        const filter = filterIndex >= 0 ? rest[filterIndex + 1] : "all";
        const parsedFilter = TaskFilterSchema.parse(filter);
        return { exitCode: 0, output: JSON.stringify(listTasks(taskStore, parsedFilter)) };
      }
      case "conclude": {
        const title = rest.join(" ").trim();
        return { exitCode: 0, output: JSON.stringify(concludeTask(taskStore, title)) };
      }
      case "remove": {
        const title = rest.join(" ").trim();
        removeTask(taskStore, title);
        return { exitCode: 0, output: "Task removed." };
      }
      default:
        return { exitCode: 1, output: "Usage: cli create|list|conclude|remove [title] [--filter all|open|done]" };
    }
  } catch (error) {
    if (error instanceof TaskStorageParseError) {
      return { exitCode: 1, output: error.message };
    }
    if (error instanceof TaskStorageValidationError) {
      return { exitCode: 1, output: error.message };
    }
    if (error instanceof TaskStorageReadError) {
      return { exitCode: 1, output: error.message };
    }
    if (error instanceof TaskStorageWriteError) {
      return { exitCode: 1, output: error.message };
    }
    const message = error instanceof Error ? error.message : "Internal server error.";
    return { exitCode: 1, output: message };
  }
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  const result = runTaskCli(process.argv.slice(2));
  if (result.exitCode === 0) {
    console.log(result.output);
  } else {
    console.error(result.output);
  }
  process.exitCode = result.exitCode;
}
