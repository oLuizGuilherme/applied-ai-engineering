export class TaskValidationError extends Error {
  constructor(message = "Task title must contain at least one non-whitespace character.") {
    super(message);
    this.name = "TaskValidationError";
  }
}

export class TaskAlreadyExistsError extends Error {
  constructor(title: string) {
    super(`A task titled "${title}" already exists.`);
    this.name = "TaskAlreadyExistsError";
  }
}

export class TaskNotFoundError extends Error {
  constructor(title: string) {
    super(`No task titled "${title}" was found.`);
    this.name = "TaskNotFoundError";
  }
}

export class TaskStorageReadError extends Error {
  constructor(message = "Could not read the task storage file.") {
    super(message);
    this.name = "TaskStorageReadError";
  }
}

export class TaskStorageParseError extends Error {
  constructor(message = "The task storage file contains malformed JSON.") {
    super(message);
    this.name = "TaskStorageParseError";
  }
}

export class TaskStorageValidationError extends Error {
  constructor(message = "The task storage file contains invalid task state.") {
    super(message);
    this.name = "TaskStorageValidationError";
  }
}

export class TaskStorageWriteError extends Error {
  constructor(message = "Could not write the task storage file.") {
    super(message);
    this.name = "TaskStorageWriteError";
  }
}
