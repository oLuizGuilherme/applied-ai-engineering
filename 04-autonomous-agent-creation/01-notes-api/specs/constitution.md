# Constitution - notes-api

Non-negotiable principles that the spec, plan, tasks, and code must follow.

1. Explicit layers. Dependencies must flow through http/cli -> service -> store. The domain layer must not perform any I/O.
2. Boundary validation. All external inputs must be validated with Zod before being converted into domain objects.
3. Domain errors. Expected and predictable errors must be represented by domain error classes and translated at the boundaries.
4. Tests are essential. Every task must include tests, and typechecking must remain green.
5. Safety by design. No secrets in the repository. Destructive actions must have guardrails (denylist + pre-commit hooks). Never blindly trust the model.
6. Spec first. Relevant changes must follow spec -> plan -> tasks -> implementation, with human review between phases.
7. Small and reversible. Each task must be small enough to fit into a single commit.

## Mandatory stack

Node.js 24, TypeScript with ESM and strict mode, Zod, node:test via tsx, node:http.
