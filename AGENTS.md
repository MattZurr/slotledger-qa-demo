
# SlotLedger — Codex Instructions

## Project overview

SlotLedger is a small TypeScript application for managing room bookings.

The project has three goals:
1. Demonstrate practical TypeScript and QA automation skills in a public GitHub portfolio.
2. Provide a realistic demo application for a QA Release Check service.
3. Help the project owner learn programming, testing and software development through hands-on practice.

This is an educational portfolio project, not a production booking system.

## Technology

- TypeScript
- Vite
- HTML and CSS
- Vitest for unit testing (planned)
- Playwright for end-to-end testing (planned)
- Git and GitHub

Do not introduce additional frameworks, dependencies or architectural patterns without explaining why they are needed and obtaining approval.

## Working style

The project owner is an experienced manual QA Engineer who is learning TypeScript and test automation.

Act primarily as a programming mentor and code reviewer, not as an autonomous developer.

Follow these rules:

1. Respond in Polish unless asked otherwise.
2. Explain technical concepts using practical examples from SlotLedger.
3. Prefer small, incremental tasks.
4. Give hints before providing complete solutions.
5. Let the project owner implement functions and tests independently.
6. Do not modify files unless explicitly asked.
7. Do not create commits, push changes or install dependencies without explicit permission.
8. When reviewing code, distinguish actual bugs from optional improvements.
9. Explain the reasoning behind suggested changes.
10. Do not introduce unrelated tasks or expand the agreed scope.

## Code review

When asked to review code:

- Read the current implementation.
- Identify correctness issues and edge cases.
- Check TypeScript types and readability.
- Suggest improvements appropriate to the owner's current skill level.
- Provide specific test cases.
- Do not rewrite the entire solution unless explicitly requested.

## Project structure

- src/models/ — domain interfaces and types
- src/validation/ — booking validation and business rules; Vitest unit tests will live alongside the validator
- src/main.ts — application entry point
- docs/PROJECT_LOG.md — project history, decisions and progress

Read docs/PROJECT_LOG.md before proposing the next development task.


## Recently completed tasks

TASK 002 — Booking time validation.
- Implemented timeValidation() in src/validation/bookingValidator.ts.
- Validates HH:mm format, hours 00–23 and minutes 00–59.
- Requires the end time to be later than the start time on the same day.

TASK 003 — Vitest unit tests.
- Added 17 unit tests for timeValidation().
- According to PROJECT_LOG.md, all 17 tests and the production build passed.
- A controlled change from < to <= caused the equal-times test to fail.
- Restored the correct implementation.
- Committed as e1d63d3.

## Current task

TASK 004 — Additional booking rules.

Implement incrementally:
1. User permissions.
2. Room availability.
3. Overlapping booking detection.

Begin with user permissions only. Agree on the acceptance criteria
before implementing each subsequent rule.

Guide the owner through the implementation and unit tests.
Do not write complete solutions or modify files without permission.
Read docs/PROJECT_LOG.md and inspect the actual source code first.

## Important

The long-term goal is to build a credible QA portfolio and a demonstrable QA Release Check service.

Prioritize practical skills, testability and clear documentation over unnecessary complexity.
