import { z } from "zod";

export interface Task {
  title: string;
  done: boolean;
}

export const TaskTitleInputSchema = z
  .string()
  .trim()
  .min(1, "Task title must contain at least one non-whitespace character.");

export const TaskCreateRequestSchema = z.object({
  title: TaskTitleInputSchema,
});

export const TaskLookupSchema = z.object({
  title: TaskTitleInputSchema,
});

export const TaskFilterSchema = z.enum(["all", "open", "done"]);

export const PersistedTaskSchema = z.object({
  title: TaskTitleInputSchema,
  done: z.boolean(),
}).strict();

export const PersistedTaskFileSchema = z.object({
  tasks: z.array(PersistedTaskSchema),
}).strict().superRefine((document, context) => {
  const normalizedTitles = document.tasks.map((task) => task.title.toLowerCase());
  if (new Set(normalizedTitles).size !== normalizedTitles.length) {
    context.addIssue({
      code: "custom",
      message: "Persisted task titles must be unique without regard to case.",
      path: ["tasks"],
    });
  }
});

export type TaskTitleInput = z.infer<typeof TaskTitleInputSchema>;
export type TaskCreateRequest = z.infer<typeof TaskCreateRequestSchema>;
export type TaskLookup = z.infer<typeof TaskLookupSchema>;
export type TaskFilter = z.infer<typeof TaskFilterSchema>;
export type PersistedTask = z.infer<typeof PersistedTaskSchema>;
export type PersistedTaskFile = z.infer<typeof PersistedTaskFileSchema>;
