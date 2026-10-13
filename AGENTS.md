# SlotLedger — Codex Instructions

## Project overview

SlotLedger is a small TypeScript room-booking application built as a QA Automation portfolio project.

The project has three goals:
1. Demonstrate practical TypeScript, testing and QA automation skills in a public GitHub repository.
2. Provide a realistic application for a future QA Release Check case study.
3. Keep implementation decisions explicit, testable and easy to explain during technical interviews.

This is an educational portfolio project, not a production booking system.

## Technology

Current:
- TypeScript
- Vite
- HTML and CSS
- Vitest
- Browser `localStorage`
- Git and GitHub

Planned:
- GitHub Actions
- Playwright

Do not introduce a framework, backend, database or new dependency unless it solves an agreed project need and the owner approves it first.

## Working style

Act primarily as a programming mentor and code reviewer, not as an autonomous developer.

Follow these rules:

1. Respond in Polish unless asked otherwise.
2. Explain concepts using practical examples from SlotLedger.
3. Prefer bounded, complete functional tasks with clear acceptance criteria and one review after implementation. Break work into individual statements only when the owner asks or needs help.
4. Give hints before providing complete solutions.
5. Let the owner implement functions and tests independently whenever practical.
6. Do not modify files unless explicitly asked.
7. Do not create commits, push changes or install dependencies without explicit permission.
8. The owner normally runs Git commands himself for practice.
9. When reviewing code, distinguish:
   - blocking bugs,
   - valuable improvements,
   - optional refactors.
10. Explain why a suggested change matters.
11. Do not silently expand scope.
12. Before proposing the next task, read `docs/PROJECT_LOG.md` and inspect the current repository state.
13. If code, Git history and documentation disagree, report the mismatch instead of guessing.
14. Prefer understandable code the owner can explain line by line over clever abstractions.
15. Preserve previously agreed behavior unless a change is explicitly discussed.
16. Keep the agreed pre-publication scope closed. Any new blocker must identify a concrete defect and its impact; optional review comments must not trigger extra correction rounds.
17. Test business risks and agreed boundaries, not a target test count. Use parameterized tests where helpful; rewriting existing tests or adding speculative cases must not delay the demo.
18. Describe AI assistance accurately in the README: it includes mentoring, design and test-scenario suggestions, debugging, code review, code examples and documentation. The owner implements with guidance and makes final inclusion decisions. Do not claim fully independent authorship or review-only AI use. Update the description if the actual contribution changes; per-test labels and authorship percentages are unnecessary.

## Portfolio-first rule

The project is now being prepared for public use in the owner's LinkedIn profile and job applications.

The immediate objective is not to finish the entire application before publication.

The objective is:

1. remove the few remaining credibility-blocking data-validation gaps,
2. complete the minimal working UI before publication,
3. add reproducible CI, a recruiter-oriented README and concise QA evidence,
4. verify and publish the repository and website demo for LinkedIn/CV,
5. continue development publicly while job applications are active.

Decision updated on 2026-10-13: the owner wants to finish the minimal UI today and publish only after it works, to support a strong first impression. This is a delivery target, not permission to skip correctness checks. Order: TASK 005E.1 -> TASK 005E.2 -> TASK 006 -> TASK 005F -> publication. Task numbers remain unchanged. Hosting has not yet been selected; a public repository and a hosted website are separate deliverables.

When suggesting work, classify recommendations as:

### Blocking before publication
Known defects affecting the agreed booking flow or data consistency, misleading test claims, and missing agreed publication deliverables (minimal UI, CI, README and verification). Do not classify every possible future improvement as a blocker.

### Valuable after publication
Features that materially improve the portfolio but are not required before the owner starts applying.

### Optional refactor
Cleanup or abstraction that must not delay publication or job applications unless it fixes a real correctness problem.

Do not keep expanding the pre-publication scope with low-probability edge cases or architecture work.

## Code review

When asked to review code:

- read the current implementation and relevant tests,
- check correctness, edge cases, TypeScript types and separation of responsibilities,
- check whether tests actually detect the behavior they claim to verify,
- reuse existing business rules instead of duplicating them,
- suggest improvements appropriate to the current project scale,
- distinguish required changes from optional refactors,
- do not rewrite the entire solution unless explicitly requested.

Codex runs `npm run test:run` directly when verifying code changes, including during incremental reviews. Do not ask the owner to run it or paste its output.

Before closing a task, Codex runs:

```bash
npm run test:run
```

Ask the owner to run the build:

```bash
npm run build
```

Do not claim those commands passed unless the result is available in the current session or clearly recorded as historical verification.

## Current project structure

Relevant structure:

- `src/models/` — domain interfaces and result types
- `src/validation/` — business rules, booking creation and Vitest tests
- `src/storage/` — localStorage read/write logic and Vitest tests
- `src/main.ts` — application entry point
- `src/style.css` — current styling
- `docs/PROJECT_LOG.md` — project history, decisions and progress
- `AGENTS.md` — persistent Codex instructions

## Completed work

### TASK 000 — Project setup

Completed.

### TASK 001 — Domain models

Completed.

Current important types include:
- `Booking`
- `CreateBookingInput`
- `CreateBookingResult`
- `LoadBookingsResult`
- `SaveBookingsResult`
- `Room`
- `User`

### TASK 002 — Booking time validation

Completed and committed.

Implemented:

`timeValidation(startTime: string, endTime: string): boolean`

Behavior:
- accepts exact `HH:mm`,
- accepts hours 00–23,
- accepts minutes 00–59,
- requires end time to be later than start time,
- rejects equal times,
- rejects bookings crossing midnight.

### TASK 003 — Vitest unit tests

Completed and committed.

Vitest is configured and used as the unit-test framework.

### TASK 004 — Additional booking rules

Completed and committed.

Implemented:

`canCreateBooking(user: User): boolean`

`roomExists(roomId: number, rooms: Room[]): boolean`

`roomOverlap(
  startTime: string,
  endTime: string,
  roomId: number,
  bookings: Booking[],
  date: string
): boolean`

Important overlap behavior:
- only bookings for the same room and date are compared,
- partial overlap is rejected,
- containment in either direction is rejected,
- identical ranges are rejected,
- touching boundaries are allowed,
- an empty booking list means no overlap,
- overlap logic assumes validated fixed-width `HH:mm` values.

Final TASK 004 commit:

`098f492` — `feat: complete booking overlap validation and prepare TASK 005`

Historical verification:
- 33/33 tests passed,
- production build passed.

### TASK 005 — Booking creation and local persistence

Completed and committed.

Final TASK 005 commit:

`1c80207` — `feat: add local booking persistence with validation and tests`

#### Booking creation

Implemented:

`createBooking(
  input: CreateBookingInput,
  bookings: Booking[],
  user: User,
  rooms: Room[]
): CreateBookingResult`

Behavior:
- reuses existing business validators,
- validation order:
  1. permission,
  2. room existence,
  3. time validity,
  4. overlap,
- returns explicit failure codes,
- assigns `Booking.userId` from `user.id`,
- generates ID as the highest existing booking ID + 1,
- uses ID 1 for an empty booking list,
- generates `createdAt` with `new Date().toISOString()`,
- does not mutate the supplied bookings array.

Current creation failure codes:
- `NO_PERMISSION`
- `ROOM_NOT_FOUND`
- `INVALID_TIME`
- `ROOM_OVERLAP`

#### Local persistence

Implemented:

- `isBooking()`
- `loadBookings()`
- `saveBookings()`

Storage key:

`slotledger.bookings`

Read behavior:
- missing key -> success with `[]`,
- structurally valid booking array -> success,
- malformed JSON -> `INVALID_STORED_DATA`,
- invalid structure -> `INVALID_STORED_DATA`,
- storage access exception -> `STORAGE_READ_ERROR`,
- invalid stored data is not automatically deleted or overwritten.

Write behavior:
- serializes the supplied full booking list as JSON,
- replaces the previous stored value,
- stores an empty list as `[]`,
- storage write exception -> `STORAGE_WRITE_ERROR`.

Storage validation is intentionally structural at this point.

Historical verification at TASK 005 completion:
- 56/56 Vitest tests passed across two test files,
- production TypeScript/Vite build passed.

A later repository audit confirmed that the committed source matches the documented TASK 005 design and found no blocking problem in the completed TASK 005 scope.

## Audit findings before public publication

A repository audit identified two real data-consistency gaps that should be fixed before UI integration and public publication.

### Gap 1 — booking date validation

`CreateBookingInput.date` is currently only a TypeScript `string`.

Examples such as the following are not rejected solely because of the date:

- `""`
- `"abc"`
- `"2026-2-3"`
- `"2026-02-30"`

This can also undermine date equality assumptions used by overlap logic.

### Gap 2 — semantically invalid data loaded from storage

`isBooking()` currently validates structure and primitive types only.

For example, a stored booking with:

`startTime: "9:00"`

can pass structural validation even though `roomOverlap()` relies on fixed-width `HH:mm` values.

Therefore data loaded from storage must also satisfy the business assumptions required by the rest of the application.

## Current publication roadmap

### TASK 005E.1 — Date validation

Completed and verified on 2026-10-13. Implemented format, month/day ranges, month lengths, leap years and INVALID_DATE integration before overlap checking. Codex ran 74/74 passing tests; the owner supplied a successful TypeScript/Vite build result. Implementation commit: aea6a92 (before any documentation amendment). Next task: TASK 005E.2.

Goal:

Add explicit validation of real calendar dates.

Proposed function:

`dateValidation(date: string): boolean`

Acceptance criteria:

1. Accept only exact `YYYY-MM-DD`.
2. Reject empty or malformed values.
3. Reject extra whitespace.
4. Reject month values outside 01–12.
5. Reject impossible dates such as:
   - `2026-02-30`
   - `2026-04-31`
   - `2026-13-01`
6. Cover leap-year behavior:
   - `2024-02-29` -> valid
   - `2023-02-29` -> invalid
7. Do not add a future-only booking rule unless separately agreed.
8. Add `INVALID_DATE` to failed `CreateBookingResult` variants.
9. Integrate `dateValidation()` into `createBooking()` before overlap checking.
10. Add focused Vitest coverage, including at least one `createBooking()` test for `INVALID_DATE`.

Do not modify storage validation in this subtask.

### TASK 005E.2 — Semantic validation of stored bookings

Start only after TASK 005E.1 is completed and verified.

Goal:

Prevent stored data from violating assumptions used by booking business logic.

Required behavior to discuss and implement:

- keep structural validation,
- validate stored `date` using `dateValidation()`,
- validate stored `startTime` / `endTime` using `timeValidation()`,
- require IDs used by stored bookings to be positive safe integers,
- reject duplicate `Booking.id` values in one stored list,
- do not call `createBooking()` for storage validation,
- do not re-check current-user permissions while loading old bookings,
- preserve existing stored data on validation failure.

Do not turn this into a full production-grade data migration system.

### TASK 005F — Portfolio foundation

After TASK 005E.1, TASK 005E.2 and the minimal TASK 006 UI.

Goal:

Make the repository presentable enough to publish and link from LinkedIn/CV.

Required scope:

#### GitHub Actions CI

Add a simple Node pipeline:

```text
npm ci
npm run test:run
npm run build
```

Run it on appropriate pushes and pull requests.

Use one explicitly selected Node version.

#### Recruiter-oriented README

README should quickly explain:

- what SlotLedger is,
- what problem/rules the project demonstrates,
- current technology,
- how to install and run it,
- how to run tests,
- which business risks are covered,
- current limitations,
- current project status,
- roadmap,
- where CI/test evidence can be seen.

The README must present the repository as an actively developed QA Automation portfolio project, not as a finished production application.

#### QA risk / evidence map

Add a small concise document or README section mapping:

`business rule -> risk -> test level -> evidence`

Example:

`No overlapping bookings -> double-booked room -> unit boundary tests + later E2E -> Vitest / CI`

#### Publication checkpoint

Before changing repository visibility:

- verify tests,
- verify build,
- verify CI,
- verify the minimal UI flow: create -> display -> refresh -> booking persists, plus overlap rejection,
- review README,
- confirm no secrets or local-only files are committed,
- confirm the repository can be understood by a recruiter without reading `PROJECT_LOG.md`.

After this checkpoint the repository and website demo can be published and linked from LinkedIn/CV. Verify the same basic booking flow at the deployed URL. Choose hosting when preparing publication; do not imply that changing repository visibility deploys the website.

The agreed minimal UI is required before publication. Additional UI features and optional cleanup must not delay publication.

## Minimal UI before publication

### TASK 006 — Minimal user interface

Implement immediately after TASK 005E.2, before TASK 005F and publication.

High-level scope:
- load bookings on startup,
- display existing bookings,
- provide a booking form,
- call the existing `createBooking()` logic,
- persist successful changes through the storage module,
- surface understandable validation and storage errors,
- keep UI orchestration separate from business rules.

Use a fixed demo user and room list, labeled form fields, a readable booking list, an empty state and a simple responsive layout. Clearly describe browser-local persistence and demo identity. A successful booking must survive refresh; overlap must produce a readable rejection. Do not report successful persistence on a write error or overwrite unreadable stored data. Keep login, editing/deleting bookings, calendar widgets, elaborate styling and new dependencies outside this milestone.

Verify the main flow and overlap rejection manually before publication and record the result; do not describe these checks as automated E2E evidence.

Remain framework-free unless a deliberate project-direction decision changes this.

## After publication

### TASK 007 — Playwright E2E

Start immediately after publication, using the first meaningful UI flow. Playwright setup does not block the initial demo release.

First preferred flow:

`create booking -> booking appears -> refresh -> booking still exists`

Later cover:
- overlap rejection,
- viewer permissions,
- relevant failure states,
- critical regression paths.

Prefer:
- resilient role/label-based locators,
- web-first assertions,
- no artificial sleeps,
- trace/screenshots for failures where useful.

### TASK 008 — QA Release Check case study

Prepare:
- release checklist,
- risk-based test scope,
- known limitations,
- controlled defect examples,
- regression evidence,
- go/no-go recommendation,
- concise report suitable for portfolio discussion.

## Portfolio evidence strategy

The portfolio should emphasize QA reasoning, not only test count.

Prefer evidence such as:

`risk -> test -> defect found -> fix -> regression test -> CI verification`

The previously discovered stored-time-format issue is a useful future defect case study:

- stored booking uses `9:00`,
- structural validation accepts it,
- overlap logic assumes `HH:mm`,
- collision can be missed,
- regression protection is added.

Keep this example available for README / QA Release Check work.

## Deferred cleanup — not blocking publication

Optional later:
- extract `slotledger.bookings` to a named constant,
- normalize test descriptions such as `case1` / `case2`,
- clean formatting in `bookingStorage.ts`,
- reduce duplicated test fixtures if readability remains good,
- move `createBooking()` to a separate module if `bookingValidator.ts` becomes too large,
- consider explicit field assignment instead of `...input`,
- consider test coverage reporting later.

Do not delay publication or applications for these items.

## Immediate next action

1. Read this file and `docs/PROJECT_LOG.md`.
2. Inspect current `main`.
3. TASK 005E.1 is implemented, reviewed, tested and committed; the owner handles any documentation amendment and push.
4. Keep documentation with related code commits when practical; separate documentation commits are not required.
5. Complete and verify the agreed TASK 005E.2 scope as the next package.
6. Build and manually verify TASK 006 minimal UI, targeting 2026-10-13 completion.
7. Complete TASK 005F: CI, concise README, risk/evidence map and publication checks.
8. Prepare hosting, publish the repository and demo, verify the deployed flow, and link them from LinkedIn/CV.

The owner explicitly moved minimal UI before publication on 2026-10-13. Do not restore the old UI-after-publication order or expand the demo scope without discussion.
