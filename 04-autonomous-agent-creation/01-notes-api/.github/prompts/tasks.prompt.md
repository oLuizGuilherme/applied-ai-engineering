---
description: Break a technical plan into small, ordered, and testable tasks.
---

Create an implementation task breakdown for the feature described by the user's request.

## Rules

- Read the complete feature specification, its matching `specs/<NNN>-<slug>-plan.md`, and `specs/constitution.md` before writing tasks.
- Use the specification path given by the user. If no path is given, identify the matching `specs/<NNN>-<slug>-spec.md` from the feature description. If no unique specification can be identified, ask a clarifying question and wait.
- Read the matching `specs/<NNN>-<slug>-plan.md` file. If it is missing, ask the user to complete the planning phase first.
- Follow the specification, plan, and constitution. Preserve any human-review gates and unresolved decisions; ask for clarification when they prevent a coherent task breakdown.
- Create `specs/<NNN>-<slug>-tasks.md` using the same specification ID and slug as the feature specification. If that file already exists, ask before replacing it.
- Do not implement tasks or modify application code.

## Task requirements

- Order tasks so prerequisites appear before dependent work.
- Make each task small and reversible enough to complete in one commit.
- Give each task a stable identifier and clear, checkable completion criteria.
- State dependencies explicitly by task identifier; use `none` when a task has no prerequisites.
- Include relevant tests or verification steps in every task, consistent with the plan and constitution. Do not leave testing as a separate, unassigned final task.
- Start every task with `- [ ]` so its progress can be tracked.

Use a consistent format for each task:

```markdown
- [ ] **T<n>: <task title>**
  - **Description:** <bounded work and intended result>
  - **Dependencies:** <task identifiers or none>
  - **Completion criteria:** <observable conditions for completion>
  - **Tests:** <relevant tests or verification steps>
```
