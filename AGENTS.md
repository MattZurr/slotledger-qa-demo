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
- `src/storage/` — local booking read/write logic and its Vitest tests (TASK 005D agreed scope completed)
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

Agreed implementation scope completed and verified on 2026-10-12, including TASK 005D. Prepare the changes for the owner's commit; do not start TASK 006 automatically.

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

### Core implementation and verification (2026-10-09)

- `CreateBookingResult` exists in `src/models/booking.ts`.
- `CreateBookingInput` no longer contains `userId`; creation sets `Booking.userId` from `user.id`.
- TASK 005B validation integration is complete. `createBooking` returns `CreateBookingResult` and reuses all four validators, in order: permissions, room existence, time validity, overlap.
- Each failure returns its corresponding error code before creating the booking. `roomOverlap()` returning `true` triggers rejection; the other validators returning `false` trigger rejection.
- TASK 005C is complete. The final signature is `(input, bookings, user, rooms): CreateBookingResult`; ID and timestamp are generated internally after validation succeeds.
- ID generation uses a `for...of` loop to find the highest existing ID, then adds 1. An empty list produces ID 1; unsorted IDs `[8, 2, 5]` produce ID 9.
- `createdAt` is generated with `new Date().toISOString()`.
- Seven creation tests cover complete success, all four validation failures, ID gaps in an unsorted list, and input-array immutability. The original success test covers the empty-list ID case and uses user 7, room 12, booking 1.
- Creation tests control the clock with `vi.useFakeTimers()` and `vi.setSystemTime()` in `beforeEach`, restoring it with `vi.useRealTimers()` in `afterEach`. Expected timestamps include `.000Z`.
- The immutability test copies both the array and its entries with `bookings.map(booking => ({ ...booking }))` before calling the function, asserts successful creation, then compares the original data with the copy.
- Verification on 2026-10-09: `npm.cmd run test:run` passed 40/40 tests; `npm.cmd run build` passed. Core creation meets the agreed minimum acceptance criteria; no blocking issue was found in the reviewed changes.
- TASK 005 core creation is complete; TASK 005D persistence is still pending. No persistence, UI or new dependencies have been added.

### Historical TASK 005D handoff (2026-10-11)

- The owner approved a separate `src/storage/` module and implemented the initial read path. TASK 005D is in progress, not complete.
- `LoadBookingsResult` in `src/models/booking.ts` is `{ success: true; bookings: Booking[] } | { success: false; error: "INVALID_STORED_DATA" }`.
- `loadBookings()` reads `localStorage.getItem("slotledger.bookings")`. Missing storage (`null`) returns success with `[]`; valid data returns the parsed bookings; malformed JSON or invalid structure returns the error. Existing storage is never deleted or overwritten by this function.
- Exported `isBooking(value: unknown): value is Booking` checks a non-null object and all seven required fields using `in` and `typeof`: numeric IDs and string date/time fields. `Array.isArray` and `.every(isBooking)` validate the parsed list without a type assertion.
- This is structural validation only; date/time formats and business rules are not checked here. Storage-access exceptions from `getItem` are not handled yet (the call is outside `try`). Discuss the remaining error contract before implementing it.
- Three storage tests cover missing storage (including the key used), a valid saved booking, and malformed JSON. Tests use `vi.fn().mockReturnValue`, `vi.stubGlobal`, and `afterEach` with `vi.unstubAllGlobals`.
- Final verification: 43/43 tests passed and production build passed on 2026-10-11. The success test previously detected returning `[]` instead of `parsedBookings`; the owner corrected it.
- Still pending: structural rejection tests, saved empty-list coverage, preservation coverage, write contract and `saveBookings()` implementation/tests. No UI, dependencies, commit or push were added by the assistant.
- The owner wants a GitHub portfolio they can explain line by line. Prefer understandable code over shortening it automatically. An optional comparison with field lists and `.every()` was discussed for later, after tests; no refactor has been implemented.

### Latest TASK 005D handoff — read/write scope completed (2026-10-12)

- The owner implemented the changes incrementally. Core creation remains separate from persistence; no UI integration was added.
- `LoadBookingsResult` now allows `INVALID_STORED_DATA` or `STORAGE_READ_ERROR` in its failure variant. `loadBookings()` declares `let storedBookings: string | null`, calls `getItem` once inside its own `try/catch`, then checks for `null`. Parsing has a separate `try/catch`, preserving the distinction between access errors and invalid data.
- The agreed write contract is implemented as `saveBookings(bookings: Booking[]): SaveBookingsResult`. It serializes the whole supplied list with `JSON.stringify` and writes it with `localStorage.setItem("slotledger.bookings", ...)`, replacing the previous value. An empty list is stored as `"[]"`.
- `SaveBookingsResult` is `{ success: true } | { success: false; error: "STORAGE_WRITE_ERROR" }`. Serialization and storage access are inside `try`; success is returned after the write, and exceptions return the write error.
- Storage has 16 tests: 13 for reading and 3 for writing. Read coverage includes missing storage/key, valid data, malformed JSON, non-array JSON, null and numeric entries, missing `createdAt`, string `roomId`, mixed valid/invalid entries, saved `[]`, preservation on malformed JSON and invalid structure, and a thrown read exception. Preservation tests assert no calls to `setItem`, `removeItem`, or `clear`.
- Write tests cover the complete JSON for two bookings, a thrown write exception, and successful storage of an empty list. Each describe block restores globals in `afterEach`.
- The read-error test failed before exception handling was added, including when an accidental duplicate read remained outside `try`. The first write test detected the success-only stub (zero `setItem` calls); the write-error test failed before its `try/catch` was implemented.
- Final verification on 2026-10-12: `npm.cmd run test:run` passed 56/56 tests across two files; `npm.cmd run build` passed. This is unit coverage with mocked storage, not browser/UI integration verification.
- Structural validation remains intentionally limited to required fields and primitive types. No business-rule validation or field-list refactor was added to storage.
- No dependencies, commit or push were added by the assistant. Documentation was updated at the owner's explicit request.

### Next mentoring steps

Before writing code, inspect:
- `src/models/booking.ts`,
- `src/models/user.ts`,
- `src/models/room.ts`,
- `src/validation/bookingValidator.ts`,
- `src/validation/bookingValidator.test.ts`,
- `src/storage/bookingStorage.ts`,
- `src/storage/bookingStorage.test.ts`,
- `docs/PROJECT_LOG.md`.

Continue in small steps, letting the owner implement the code:
1. Continue from the completed read/write implementation and 56 passing tests; do not repeat the completed tests or contract design. The requested recap was delivered on 2026-10-12; revisit concepts as needed.
2. Review the current diff with the owner and prepare a meaningful commit. The owner performs Git mutations unless explicitly delegated; no commit or push has been performed by the assistant.
3. Before starting TASK 006, discuss a small UI scope with the owner. Do not automatically implement UI or introduce dependencies.
4. Continue mentoring in small steps with hints before full solutions. Do not automatically edit code or refactor explicit validation checks.

Learning covered on 2026-10-12: `unknown` versus inferred `any` from `JSON.parse`; valid JSON versus valid booking structure; `.every()` on empty and mixed arrays; early returns versus thrown exceptions; declaration versus assignment and why the storage call must be inside `try`; separate read/parse error handling; browser `localStorage` versus the chosen storage key; declaration files versus implementations; `vi.fn`, `mockImplementation`, `vi.stubGlobal`, object shorthand and cleanup scope; passing a mock versus invoking it; call-history assertions, `.not.toHaveBeenCalled()` and `.toHaveBeenCalledWith()`; checking side effects as well as return values; JSON serialization and tests detecting missing writes and uncaught exceptions.

Learning covered on 2026-10-08: distinct test IDs, success/error result variants, types versus runtime conditions, early returns, tests detecting missing validation before implementation, and required fields in `Booking[]` test data. Continue giving hints before complete code.

Learning covered on 2026-10-09: parameters versus existing object fields and local variables; tracking a maximum versus incrementing a counter; why an empty-list test cannot detect loop-body bugs; unsorted ID test data; controlled test clocks and ISO milliseconds; `map`, arrow functions, implicit object returns, object spread and independent copies; whole-result assertions already checking `success: true`.

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
- TASK 005B — core creation logic and integration with existing validation rules (completed and verified 2026-10-08)
- TASK 005C — ID and `createdAt` generation (completed and verified 2026-10-09, including input-array immutability coverage)
- TASK 005D — local persistence (agreed read/write scope completed and verified 2026-10-12; 16 storage tests, 56 total tests, production build passed)

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
