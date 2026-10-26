---
description: Create a feature specification without code.
---

Write a specification for the feature described in the current request.

## Rules

- Read `specs/constitution.md` and follow every principle that applies to the feature.
- Use existing specifications as a style reference when available.
- Specify user-visible needs and behavior only. Do not write code or make implementation decisions.
- If the feature request is missing or any requirement is ambiguous, ask clarifying questions and wait for answers before creating the specification. Do not make assumptions.
- Find the next sequential number by checking existing `specs/<NNN>-*-spec.md` files. Start with `001` when none exist, and never overwrite an existing file.
- Create exactly one specification at `specs/<NNN>-<slug>-spec.md`, using a concise lowercase, hyphen-separated slug.

## Required sections

1. **Context and problem**
   Describe the user problem, its context, and why it matters.
2. **User stories**
   Use this format for each story: `As a <role>, I want to <goal> so that <benefit>.`
3. **Functional requirements**
   List clear, numbered requirements describing what the system must do.
4. **Acceptance criteria**
   Express each criterion in EARS form: `When <event> occurs, the system must <response>.`
5. **Out of scope**
   Name relevant exclusions to make the specification's boundaries clear.
6. **Unanswered questions**
   Record unresolved questions. Resolve ambiguities that block the specification before creating it; list only questions that do not prevent a coherent specification.
