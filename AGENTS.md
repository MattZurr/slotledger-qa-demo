# SlotLedger — Codex Instructions

## Project overview

SlotLedger is a small TypeScript application for managing room bookings.

The project has three goals:
1. Demonstrate practical TypeScript and QA automation skills in a public GitHub portfolio.
2. Provide a realistic demo application for a QA Release Check service.
3. Help the project owner learn programming, testing and software development through hands-on practice.

This is an educational portfolio project, not a production booking system.

## Technology

Current:
- TypeScript
- Vite
- HTML and CSS
- Vitest for unit testing
- Git and GitHub

Planned:
- Playwright for end-to-end testing
- GitHub Actions

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
11. Before proposing the next task, read `docs/PROJECT_LOG.md` and inspect the actual repository state.
12. Do not assume that documentation is newer than the code. If they differ, report the mismatch before continuing.

## Code review

When asked to review code:

- Read the current implementation and relevant tests.
- Identify correctness issues and edge cases.
- Check TypeScript types, readability and separation of responsibilities.
- Suggest improvements appropriate to the owner's current skill level.
- Provide specific test cases.
- Distinguish blocking issues from optional refactors.
- Do not rewrite the entire solution unless explicitly requested.

## Project structure

Current relevant structure:

- `src/models/` — domain interfaces and types
- `src/validation/` — booking validation/business rules and Vitest unit tests
- `src/main.ts` — application entry point
- `docs/PROJECT_LOG.md` — project history, decisions and progress
- `AGENTS.md` — persistent instructions for Codex

Do not add new top-level architecture without discussing it first.

## Completed work

### TASK 000 — Project setup
Completed.

### TASK 001 — Domain models
Completed.
Defined `Booking`, `CreateBookingInput`, `Room` and `User`.

### TASK 002 — Booking time validation
Completed and committed.

Implemented:

`timeValidation(startTime: string, endTime: string): boolean`

Behavior:
- accepts only fixed-width `HH:mm`,
- hours 00–23,
- minutes 00–59,
- end time must be later than start time,
- bookings crossing midnight are rejected.

### TASK 003 — Vitest unit tests
Completed and committed.

- Vitest configured.
- 17 tests added for `timeValidation()`.
- Controlled negative check confirmed that the equal-times test detects an incorrect `<=` implementation.

### TASK 004 — Additional booking rules
Completed and committed on 2026-10-05.
Final commit: `098f492` — feat: complete booking overlap validation and prepare TASK 005.

Implemented:

`canCreateBooking(user: User): boolean`
- `booker` -> `true`
- `viewer` -> `false`

`roomExists(roomId: number, rooms: Room[]): boolean`
- returns whether a room with the requested ID exists.

`roomOverlap(startTime: string, endTime: string, roomId: number, bookings: Booking[], date: string): boolean`
- checks only bookings for the same room and date,
- detects partial overlaps,
- detects containment in both directions,
- detects identical ranges,
- touching boundaries are allowed,
- empty booking lists return `false`,
- assumes the supplied times have already passed `timeValidation()`.

Verification recorded for TASK 004:
- 33/33 Vitest tests passed.
- TypeScript/Vite production build passed.
- An independent review found no blocking issue in the current TASK 004 implementation.

## Current task

TASK 005 — Booking creation.

Do not start by implementing the whole task at once.

### TASK 005A — agreed contract (2026-10-06)

The contract and minimum acceptance criteria have been agreed. Continue from these decisions rather than restarting contract design.

- Inputs: `input: CreateBookingInput`, `bookings: Booking[]`, `user: User`, `rooms: Room[]`.
- Return type: `CreateBookingResult`, with `{ success: true; booking: Booking }` or `{ success: false; error: ... }`.
- Error codes: `NO_PERMISSION`, `ROOM_NOT_FOUND`, `INVALID_TIME`, `ROOM_OVERLAP`.
- Reuse `canCreateBooking`, `roomExists`, `timeValidation` and `roomOverlap`; validate times before checking overlap.
- Generate ID as the highest existing booking ID plus 1; use 1 for an empty list. Do not use array length plus 1.
- Generate `createdAt` with `new Date().toISOString()` after validation succeeds.
- Remove `userId` from `CreateBookingInput`; set `Booking.userId` from the supplied `user.id`. Keep `userId` in `Booking`.
- Return a single booking in the success result. Updating the booking list and persistence are separate responsibilities.
- Do not add persistence or UI yet.

Minimum unit-test acceptance criteria:
- Successful creation returns a complete booking with the input fields, `user.id`, generated ID and ISO creation timestamp.
- Each of the four validation failures returns its corresponding error code.
- ID generation handles an empty booking list and gaps in existing IDs.
- The input booking array remains unchanged.

### Current implementation and verification (2026-10-06)

- `CreateBookingResult` exists in `src/models/booking.ts`.
- `CreateBookingInput` no longer contains `userId`; creation sets `Booking.userId` from `user.id`.
- `createBooking` returns `CreateBookingResult` and rejects users without permission with `NO_PERMISSION` before creating the booking.
- The temporary signature is `(input, id, createdAt, bookings, user, rooms)`. Passing ID and timestamp is an unfinished deviation from the agreed contract; move their generation inside the function in TASK 005C.
- One creation success test checks the complete result with `toEqual`. A permission rejection test is still pending.
- Verification on this computer: 34/34 tests passed; the build failed with TS6133 because `bookings` and `rooms` are not used yet. Remaining validation and ID generation are unfinished.
- The successful TASK 004 build recorded above does not verify the TASK 005 sketch.

### Next mentoring steps

Before writing code, inspect:
- `src/models/booking.ts`,
- `src/models/user.ts`,
- `src/models/room.ts`,
- `src/validation/bookingValidator.ts`,
- `src/validation/bookingValidator.test.ts`,
- `docs/PROJECT_LOG.md`.

Continue in small steps, letting the owner implement the code:
1. Resume the explanation of the success test: the owner accepted editor suggestions and wants to understand the code. Give hints before complete solutions.
2. Use distinct user, room and booking IDs in the success test (currently all are 1) to detect incorrect field assignments. This exercise is suggested but not implemented yet.
3. Add a `viewer` test expecting `{ success: false, error: "NO_PERMISSION" }`.
4. Add room existence, time and overlap validation incrementally with tests. Then generate ID / `createdAt` internally and update the test calls to the agreed four-input signature.
5. Add creation tests incrementally and run tests / build. Dependency installation, if needed on another computer, requires explicit permission.
6. Keep persistence and UI out of scope until the core logic is reviewed and tested.

### TASK 005 constraints

- Reuse existing validators instead of duplicating their logic.
- Keep booking creation independent from the UI.
- Do not add `localStorage` until the basic creation logic has been reviewed and tested.
- Do not introduce a backend, database, framework or new dependency without approval.
- Do not implement UI work from TASK 006.
- Keep invalid-input behavior explicit and testable.
- Add unit tests incrementally.
- Give hints before complete code.
- Do not modify files without explicit permission.

### Planned TASK 005 sequence

The contract above is agreed; the intended progression is:

- TASK 005A — booking creation contract and acceptance criteria (agreed)
- TASK 005B — core creation logic and integration with existing validation rules (incomplete sketch exists)
- TASK 005C — ID and `createdAt` generation
- TASK 005D — local persistence after the core logic is verified

Do not treat this sequence as fixed if the actual code suggests a simpler design. Discuss changes first.

## Important

The long-term goal is to build a credible QA portfolio and a demonstrable QA Release Check service.

Prioritize:
- practical TypeScript skills,
- explicit business rules,
- testability,
- readable code,
- meaningful Git history,
- clear documentation,

over unnecessary complexity or impressive-sounding architecture.
