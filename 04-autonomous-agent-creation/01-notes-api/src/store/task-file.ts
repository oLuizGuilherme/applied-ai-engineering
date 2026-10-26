import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function resolveTaskFilePath(
  startDirectory = dirname(fileURLToPath(import.meta.url)),
): string {
  let currentDirectory = resolve(startDirectory);

  while (true) {
    if (existsSync(join(currentDirectory, "package.json"))) {
      return join(currentDirectory, "tasks.json");
    }

    const parentDirectory = dirname(currentDirectory);
    if (parentDirectory === currentDirectory) {
      throw new Error("Could not locate the project package.json for task storage.");
    }
    currentDirectory = parentDirectory;
  }
}

export function getTaskFilePath(): string {
  return resolveTaskFilePath();
}
