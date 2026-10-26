---
description: Generate a technical plan from an existing feature specification.
---

Generate a technical plan for the feature described by the user's request.

## Rules

- Read `specs/constitution.md` and the complete feature specification before planning.
- Use the specification path given by the user. If no path is given, identify the matching `specs/<NNN>-<slug>-spec.md` file from the feature description. If no unique specification can be identified, ask a clarifying question and wait.
- Follow the constitution, the specification, and existing repository patterns. Preserve the dependency flow `http/cli -> service -> store`; keep domain logic free of I/O.
- Make proposed technical decisions explicit, with trade-offs, and flag decisions or risks that require human review. Do not present unreviewed proposals as approved decisions.
- Include only behavior and contracts supported by the specification. If required details are ambiguous or contradictory, ask clarifying questions and wait rather than inventing requirements.
- Create a `specs/<NNN>-<slug>-plan.md` file inside `specs/` that uses the same specification ID and slug as its feature specification (for example, `001-task-management-plan.md`). The plan file must include the specification ID in its header or title.
- If that file already exists, ask before replacing it.
- Do not implement the plan or modify code.

## Required sections

1. **Architecture**
   Identify the layers and files to create or modify, describing responsibilities and preserving the dependency flow `http/cli -> service -> store`. Include only layers relevant to the feature.
2. **Data model**
   Describe proposed Zod schemas and TypeScript types, including boundary validation needs. Mark items as not applicable when the feature needs no data-model changes.
3. **Contracts**
   Describe relevant HTTP routes and CLI commands, including inputs and outputs. Mark either surface as not applicable when the feature does not change it; do not invent endpoints or commands.
4. **Decisions and trade-offs**
   List proposed technical decisions and their alternatives or trade-offs. Identify which decisions need human review.
5. **Test strategy**
   Describe focused tests using `node:test` via `tsx`, covering relevant layers and behavior. Include typechecking and any constitution-required test coverage.
6. **Risks and human review**
   Identify material risks, unresolved assumptions, and review gates. Reference unanswered specification questions; request clarification when any blocks a coherent plan.
