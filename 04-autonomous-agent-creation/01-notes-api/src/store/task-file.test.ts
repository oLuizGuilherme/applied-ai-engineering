import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { resolveTaskFilePath } from "./task-file.js";

test("resolveTaskFilePath finds tasks.json beside package.json", () => {
  const temporaryDirectory = mkdtempSync(join(tmpdir(), "notes-api-root-"));
  const nestedDirectory = join(temporaryDirectory, "src", "store");
  mkdirSync(nestedDirectory, { recursive: true });
  writeFileSync(join(temporaryDirectory, "package.json"), "{}");

  try {
    assert.equal(
      resolveTaskFilePath(nestedDirectory),
      join(temporaryDirectory, "tasks.json"),
    );
  } finally {
    rmSync(temporaryDirectory, { recursive: true, force: true });
  }
});

test("resolveTaskFilePath uses the project package root instead of nested directories", () => {
  const temporaryDirectory = mkdtempSync(join(tmpdir(), "notes-api-package-"));
  const nestedDirectory = join(temporaryDirectory, "nested", "working-directory");
  mkdirSync(nestedDirectory, { recursive: true });
  writeFileSync(join(temporaryDirectory, "package.json"), "{}");

  try {
    const firstResult = resolveTaskFilePath(nestedDirectory);
    assert.equal(firstResult, join(temporaryDirectory, "tasks.json"));
  } finally {
    rmSync(temporaryDirectory, { recursive: true, force: true });
  }
});
