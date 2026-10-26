# Task management specification

## Context and problem

Users need a simple way to track tasks in the notes API project. They must be
able to create tasks identified by their titles, see all tasks or filter by
whether they are open or done, mark tasks as done, and remove tasks. These
capabilities must be available through both HTTP and the CLI so users can
manage tasks through either interface.

## User stories

- As a user, I want to create a task with a title so that I can keep track of
  work I need to do.
- As a user, I want to list all tasks or filter for open or done tasks so that
  I can see work by its current state.
- As a user, I want to conclude a task so that I can mark work as done.
- As a user, I want to remove a task so that it no longer appears in my task
  list.
- As a user, I want these task operations available through HTTP and the CLI so
  that I can choose how to interact with the application.

## Functional requirements

1. The system must allow a user to create a task by providing a title.
2. A task title must contain non-whitespace characters. The system must trim
   surrounding whitespace before storing the title.
3. Task titles must be unique when compared without regard to case. The
   original casing of a stored title must be preserved.
4. Each new task must be open.
5. The system must allow users to list all tasks, only open tasks, or only done
   tasks. If no filter is specified, the list must include all tasks.
6. The system must allow a user to conclude a task by its title. Concluding a
   task marks it done, whether it was previously open or done.
7. The system must allow a user to remove a task by its title, whether it is
   open or done.
8. The system must provide the create, list, conclude, and remove capabilities
   through both HTTP and the CLI, with consistent task state and outcomes.
9. The system must report a clear failure when a title is blank, already in
   use, or does not identify an existing task for conclude or remove.

## Acceptance criteria

- When a user creates a task with a nonblank title, the system must create an
  open task and retain the title's original casing after trimming surrounding
  whitespace.
- When a user creates a task with a blank or whitespace-only title, the system
  must reject the request and report the title validation failure.
- When a user creates a task whose trimmed title matches an existing task
  without regard to case, the system must reject the request and report that
  the title is already in use.
- When a user lists tasks without a filter, the system must return all tasks.
- When a user lists tasks with the open filter, the system must return only
  open tasks.
- When a user lists tasks with the done filter, the system must return only
  done tasks.
- When a user concludes a task by a title matching an existing title without
  regard to case, the system must mark that task done.
- When a user removes a task by a title matching an existing title without
  regard to case, the system must remove that task from subsequent lists.
- When a user concludes or removes a task using a title that does not match an
  existing task, the system must report that the task was not found.
- When a user performs a supported task operation through HTTP or the CLI, the
  system must apply the same task rules and expose the corresponding outcome.

## Out of scope

- Task descriptions, priorities, due dates, or other task fields.
- Editing a task title or reopening a done task.
- Defining specific HTTP routes, request/response formats, or CLI command
  syntax.

## Unanswered questions

- None.
