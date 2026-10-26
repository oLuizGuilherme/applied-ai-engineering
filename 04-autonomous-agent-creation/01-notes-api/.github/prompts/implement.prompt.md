---
description: Implement the next eligible task from a feature's task list.
---

Implement the tasks listed in the feature's `specs/<NNN>-<slug>-tasks.md`, one task at a time.

## Before starting

- Identify the feature specification from the path given by the user. If no path is given, identify the matching `specs/<NNN>-<slug>-spec.md` from the feature description. If no unique specification can be identified, ask a clarifying question and wait.
- Read the complete specification, its matching `specs/<NNN>-<slug>-plan.md` and `specs/<NNN>-<slug>-tasks.md`, `specs/constitution.md`, project instructions, and any instruction files that apply to the files the selected task may affect.
- Select the earliest pending task (`- [ ]`) whose declared dependencies are all complete (`- [x]`). If a task is blocked, dependencies are unclear, or no pending task is eligible, stop and explain why.

## Implementing one task

1. Implement only the selected task, following the specification, plan, project instructions, and constitution.
2. Add or update the tests required by the task and relevant to the behavior changed.
3. Run `npm run test` and `npm run typecheck`. Both commands must pass before marking the task complete.
4. If either command fails, do not mark the task complete. Report the failure and leave the task pending.
5. After both commands pass, update only the selected task's checkbox from `- [ ]` to `- [x]`.
6. Summarize the changes and validation, then stop for human review. Continue with another task only after the user approves proceeding.

## Guardrails

- If you find a problem with the specification, plan, task list, or another requirement, stop immediately and explain the issue before making further changes.
- Ask for clarification instead of guessing when requirements conflict or are ambiguous.
- Preserve tests and strict type checking; never disable tests or weaken type checking to make validation pass.
- Keep changes limited to the selected task and its directly related tests. Do not commit changes.
