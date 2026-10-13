# SlotLedger — Project Log

## 1. Project goals

SlotLedger is an educational TypeScript room-booking application used as a QA Automation portfolio project.

Main goals:
- demonstrate practical TypeScript and QA automation skills,
- learn implementation and testing of business rules,
- develop automated tests with Vitest and later Playwright,
- create a realistic application for a QA Release Check case study,
- build a public GitHub repository that can support LinkedIn/CV job applications.

## 2. Repository

Repository:

`MattZurr/slotledger-qa-demo`

Default branch:

`main`

The repository is the source of truth for current code.

This log is the source of truth for major project decisions, task history and roadmap.

## 3. Technology

Current:
- TypeScript
- Vite
- HTML and CSS
- Vitest
- browser `localStorage`
- Git and GitHub

Planned:
- GitHub Actions
- Playwright

## 4. Completed tasks

### TASK 000 — Project setup

Status: Completed.

Completed:
- created a Vite vanilla TypeScript project,
- removed unnecessary starter code,
- initialized Git,
- renamed the primary branch to `main`,
- verified the production build.

### TASK 001 — Domain models

Status: Completed and committed.

Key commit:

`4751dde` — `feat: add booking domain models`

Initial models:
- `Booking`
- `CreateBookingInput`
- `Room`
- `User`

The model layer was later extended with result unions for booking creation and storage operations.

### TASK 002 — Booking time validation

Status: Completed and committed.

Commit:

`e1f0042` — `feat: complete booking time validation`

Implemented:

`timeValidation(startTime: string, endTime: string): boolean`

Rules:
- exact `HH:mm`,
- valid hour range,
- valid minute range,
- same-day booking,
- end later than start,
- equal times rejected,
- midnight crossing rejected.

### TASK 003 — Unit tests

Status: Completed and committed.

Commit:

`e1d63d3` — `test: add booking time validation tests`

Completed:
- configured Vitest,
- added initial time-validation tests,
- used a controlled mutation to confirm that an important regression test actually detected a defect.

### TASK 004 — Additional booking rules

Status: Completed and committed.

Relevant commits:
- `54024e4` — `feat: validate user booking permissions`
- `b8558c7` — WIP commit containing `roomExists()` and tests
- `098f492` — `feat: complete booking overlap validation and prepare TASK 005`

Implemented:
- `canCreateBooking(user)`
- `roomExists(roomId, rooms)`
- `roomOverlap(startTime, endTime, roomId, bookings, date)`

Important overlap behavior:
- compare only same room/date,
- partial overlap rejected,
- containment rejected in both directions,
- identical ranges rejected,
- touching boundaries allowed.

Recorded verification:
- 33/33 tests passed,
- production build passed.

### TASK 005 — Booking creation and local persistence

Status: Completed, verified and committed.

Important commits:
- `0a9445b` — `WIP: start booking creation implementation`
- `6455149` — `WIP: record TASK 005 contract and booking creation sketch`
- `717db78` — `WIP: add booking creation result and first success test`
- `b6306d1` — `feat: complete TASK 005B booking creation validation`
- `ec6426b` — `feat: complete booking ID and timestamp generation`
- `1c80207` — `feat: add local booking persistence with validation and tests`

#### TASK 005A — creation contract

Final creation inputs:
- `input: CreateBookingInput`
- `bookings: Booking[]`
- `user: User`
- `rooms: Room[]`

Result:
`CreateBookingResult`

Failure codes:
- `NO_PERMISSION`
- `ROOM_NOT_FOUND`
- `INVALID_TIME`
- `ROOM_OVERLAP`

Creation returns one `Booking`.

Updating the list and persistence remain separate responsibilities.

#### TASK 005B — validation integration

`createBooking()` reuses:
- `canCreateBooking()`
- `roomExists()`
- `timeValidation()`
- `roomOverlap()`

Validation order:
1. permission,
2. room existence,
3. time validity,
4. overlap.

Each failure returns an explicit result instead of throwing.

#### TASK 005C — booking completion

Completed:
- `CreateBookingInput` does not contain `userId`,
- `Booking.userId` comes from `user.id`,
- ID = highest existing booking ID + 1,
- empty list starts at ID 1,
- unsorted and gapped IDs are handled,
- `createdAt` uses `new Date().toISOString()`,
- existing booking list is not mutated,
- exact timestamp tests use a controlled clock.

Recorded verification after core creation:
- 40/40 tests passed,
- production build passed.

#### TASK 005D — local persistence

Implemented:
- `src/storage/bookingStorage.ts`
- `src/storage/bookingStorage.test.ts`
- `LoadBookingsResult`
- `SaveBookingsResult`
- `isBooking()`
- `loadBookings()`
- `saveBookings()`

Read behavior:
- key: `slotledger.bookings`,
- missing key -> success with `[]`,
- structurally valid booking array -> success,
- malformed JSON -> `INVALID_STORED_DATA`,
- invalid structure -> `INVALID_STORED_DATA`,
- read exception -> `STORAGE_READ_ERROR`,
- invalid stored data is preserved.

Write behavior:
- replaces the full stored booking list using JSON,
- empty list is stored as `[]`,
- write exception -> `STORAGE_WRITE_ERROR`.

`isBooking()` intentionally validates structure and primitive types only.

Final historical verification:
- 56/56 Vitest tests passed across two test files,
- `npm run build` passed.

Final TASK 005 commit:

`1c80207` — `feat: add local booking persistence with validation and tests`

### Post-TASK-005 repository audit — 2026-10-12

The current `main` branch, source files, tests, documentation, package configuration and recent Git history were reviewed.

Results:
- implementation matches the documented TASK 005 design,
- no blocking issue was found inside the agreed TASK 005 scope,
- business logic and persistence are appropriately separated,
- storage performs runtime structural validation before returning parsed data,
- the audit did not independently execute the local test suite.

A second Codex audit also ran the current local tests/build and reported:
- 56/56 tests passing,
- production build passing,
- TypeScript strict checking passing,
- clean working tree,
- local `main` aligned with `origin/main`.

## 5. Portfolio strategy change — 2026-10-12

Historical decision: the UI-after-publication ordering below was superseded on 2026-10-13 by the update at the end of this section.

The owner is beginning an active job search immediately.

Previous implicit strategy:

`finish project -> publish -> start applying`

New strategy:

`reach stable portfolio milestone -> publish -> apply immediately -> continue developing publicly`

Reason:
job searches often take multiple weeks, so delaying applications until UI, Playwright and the complete QA Release Check are finished has a real opportunity cost.

The repository does not need to be feature-complete before publication.

It does need to be:
- technically credible,
- understandable to a recruiter,
- free from known important correctness gaps,
- reproducibly testable,
- honest about current limitations and roadmap.

Development and job applications will therefore run in parallel after the publication milestone.

### Updated delivery decision — 2026-10-13

The owner wants to complete the minimal UI today and publish the website only after it works, so the first LinkedIn presentation includes a usable demo. The agreed order is now:

`005E.1 date validation -> 005E.2 storage validation -> 006 minimal UI -> 005F CI/README/evidence -> publish repository and website`

The date is a delivery target, not verified completion or a reason to skip essential checks. Existing task numbers are retained. A public repository and a hosted website are separate deliverables; hosting is not yet selected. Further UI features, Playwright and the full case study follow publication.

Work in complete, bounded functional packages with one review after implementation. The previous statement-by-statement coaching slowed delivery. Explain individual steps when requested or when the owner needs help. Keep ownership of implementation and Git with the owner unless explicitly delegated.

Keep tests focused on agreed rules and concrete risks. Parameterized cases may reduce repetition, but converting existing tests is optional. Test count, exhaustive input combinations and cosmetic refactors are not publication goals. Any newly proposed blocker must identify a concrete defect and its impact.

## 6. Audit findings that block publication milestone

### A. Missing date validation

Current `CreateBookingInput.date` is only a TypeScript `string`.

Current behavior can accept values such as:
- `""`
- `"abc"`
- `"2026-2-3"`
- `"2026-02-30"`

The audit classified this as a real missing business rule rather than a failure of the already agreed TASK 005 scope.

### B. Stored data can violate overlap assumptions

Current `isBooking()` validates field presence and primitive types.

It can therefore accept a stored booking such as:

`9:00-10:00`

even though `roomOverlap()` assumes fixed-width `HH:mm`.

A concrete audited scenario showed that:
- stored booking `9:00-10:00` was accepted,
- new booking `09:30-10:30` for the same room/date could be created successfully,
- expected overlap was missed.

This is a real contract gap between persistence validation and business logic.

### C. Stored identifiers need a minimal validity contract

A TypeScript `number` can still be:
- fractional,
- negative,
- non-safe,
- non-finite.

The audit demonstrated cases where invalid numeric IDs can break the `maxId + 1` strategy.

Pre-publication scope should remain minimal:
- stored IDs must be positive safe integers,
- duplicate `Booking.id` values should be rejected.

No UUID migration or production-grade identifier system is planned.

## 7. Completed task — TASK 005E.1

### Date validation

Status: Completed, verified and committed on 2026-10-13.

Completion evidence:
- validator checks exact format, month/day ranges, month lengths and leap years, including the 1900/2000 century cases,
- INVALID_DATE is included in CreateBookingResult and returned before overlap checking,
- a creation test checks INVALID_DATE using an invalid-format date; impossible dates are covered in validator tests,
- Codex ran the full suite: 74/74 tests passed,
- the owner supplied successful output from `npm run build` (TypeScript and Vite),
- implementation commit: aea6a92, before any documentation amendment; it includes code and project documentation.

Follow-up TASK 005E.2 is now also complete (see below). Parameterizing existing tests remains optional and must not delay the UI.

Goal:

Add a small explicit calendar-date rule before UI and public publication.

Proposed function:

`dateValidation(date: string): boolean`

Acceptance criteria:
- exact `YYYY-MM-DD`,
- reject empty values,
- reject malformed values,
- reject extra whitespace,
- reject invalid months,
- reject impossible day/month combinations,
- cover leap years,
- do not enforce future-only booking dates unless separately agreed.

Integration:
- add `INVALID_DATE` to failed `CreateBookingResult`,
- validate date before overlap in `createBooking()`,
- reuse `dateValidation()` instead of duplicating the rule,
- add focused validator tests,
- add at least one creation test proving `INVALID_DATE`,
- keep storage changes outside TASK 005E.1.

Verification before completion:
- `npm run test:run`,
- `npm run build`,
- code review,
- focused commit.

## 8. Completed task — TASK 005E.2

### Semantic validation of stored bookings

Status: Implemented, reviewed and verified on 2026-10-13; awaiting commit.

Completion evidence:
- isBooking reuses dateValidation and timeValidation after structural checks,
- id, roomId and userId must be positive safe integers,
- loadBookings rejects duplicate booking IDs while allowing shared room/user IDs,
- regression coverage rejects stored `9:00` times and reversed valid-format time ranges,
- tests verify invalid dates, all three identifier fields, duplicate IDs, valid multiple bookings and preservation of semantically invalid stored data,
- Codex ran the full suite: 93/93 tests passed across two files,
- the owner supplied successful `npm run build` output (TypeScript and Vite, built in 61 ms).

Next work package: TASK 006 minimal UI before publication.

Goal:

Prevent loaded booking data from violating assumptions used by business logic.

Scope:
- preserve existing structural validation,
- stored date must pass `dateValidation()`,
- stored start/end times must pass `timeValidation()`,
- relevant stored IDs must be positive safe integers,
- duplicate `Booking.id` values in one stored list must be rejected,
- invalid stored data remains preserved,
- loading existing bookings must not call `createBooking()`,
- loading must not depend on current-user permissions.

Do not build a general migration layer or production database validation system.

Regression case to preserve for the portfolio:

`stored 9:00-10:00 -> requested 09:30-10:30 -> previously missed overlap`

The fix and regression test should later be documented as an authentic QA defect example.

## 9. Portfolio foundation — TASK 005F

Status: Planned after TASK 006 minimal UI; TASK 006 now follows TASK 005E.2.

This is the final pre-publication milestone.

### GitHub Actions CI

Add a Node workflow that runs:

```text
npm ci
npm run test:run
npm run build
```

Use an explicitly chosen Node version.

Run on suitable pushes and pull requests.

### Recruiter-oriented README

README should allow a recruiter to understand the repository without reading this project log.

It should include:
- project purpose,
- current status,
- technology stack,
- business rules,
- test strategy,
- how to install/run,
- how to run tests,
- CI status/evidence,
- important design decisions,
- known limitations,
- roadmap,
- clear statement that this is an actively developed QA Automation portfolio project.

Do not present the application as production-ready.

### Risk / evidence map

Add a concise mapping:

`business rule -> risk -> test level -> evidence`

Examples:
- no overlapping booking -> double-booked room -> Vitest boundary cases -> CI,
- viewer cannot book -> authorization/business-rule violation -> unit test,
- invalid stored data -> corrupted state -> storage tests.

### Public repository checkpoint

Before publication:
- tests pass,
- build passes,
- CI passes,
- minimal UI works: create -> display -> refresh -> booking persists, and overlap is rejected with a readable error,
- README reviewed,
- `.gitignore` reviewed,
- no secrets committed,
- repository understandable without `PROJECT_LOG.md`,
- known blocking validation gaps closed.

After this checkpoint:
- make repository public,
- publish the website demo using the selected hosting and verify its main flow at the deployed URL,
- add it to LinkedIn,
- reference it in CV/job applications where useful,
- continue development publicly.

Optional refactors do not block this milestone.

## 10. Minimal UI before publication; later development

### TASK 006 — Minimal UI

Status: Not started. Moved before publication by the owner's decision on 2026-10-13; target is to finish the minimal UI that day. Implement after TASK 005E.2 and before TASK 005F.

High-level scope:
- load bookings on startup,
- show current bookings,
- provide booking form,
- call existing `createBooking()`,
- persist successful changes,
- display understandable business/storage errors,
- keep UI orchestration separate from business logic.

Minimum presentation scope:
- fixed demo user and room list,
- labeled booking form, readable booking list and empty state,
- simple responsive styling suitable for presenting the demo,
- clear notice that data is stored locally in the browser and identity is a demo fixture.

Completion evidence: manually verify create -> display -> refresh -> persists and overlap rejection; record actual results. Surface storage failures without claiming a successful save or overwriting unreadable stored data. Do not label manual checks as automated E2E tests.

Outside this milestone: login, editing/deleting bookings, calendar widgets, elaborate styling, new frameworks or dependencies. Additional UI features must not delay publication.

Remain framework-free unless the project direction is deliberately changed.

### TASK 007 — Playwright E2E

Begin immediately after publication using the minimal UI flow. Playwright setup is not required for the first public demo.

First target flow:

`create booking -> display booking -> refresh -> booking persists`

Later:
- overlap rejection,
- viewer role,
- selected storage/error paths,
- critical regression flows.

### TASK 008 — QA Release Check case study

Prepare:
- risk-based test scope,
- release checklist,
- manual + automated evidence,
- known limitations,
- controlled defect examples,
- regression evidence,
- go/no-go recommendation,
- concise sample report.

## 11. Portfolio positioning

The strongest portfolio signal should be QA reasoning rather than raw test count.

Preferred evidence pattern:

`business risk -> test -> defect discovered -> root cause -> fix -> regression protection -> CI evidence`

The stored-time-format defect discovered during the audit is a strong candidate for a later case study.

## 12. Deferred cleanup

Optional and non-blocking:
- extract `slotledger.bookings` to a constant,
- improve a few test names,
- format `bookingStorage.ts`,
- reduce repeated fixtures if readability is preserved,
- move `createBooking()` if the validator module becomes too large,
- consider explicit field assignment instead of `...input`,
- add coverage reporting later.

Do not postpone public publication or job applications for these items.

## 13. Development principles

- The owner writes code independently whenever practical.
- AI acts as mentor and reviewer.
- AI also contributes design and test-scenario suggestions, debugging guidance, code examples and documentation. The README should briefly disclose this actual scope without claiming fully independent authorship or review-only assistance. The owner implements with guidance and makes final inclusion decisions. Revisit the description if AI later implements entire modules; per-test labels and authorship percentages are not required.
- Documentation may accompany related code in the same commit; separate documentation commits are not required.
- Give hints before full solutions.
- The owner normally runs Git commands.
- Working-style update (2026-10-13): Codex runs `npm run test:run` directly during verification and reports the result; the owner does not need to run tests or paste their output. The existing build-verification arrangement remains unchanged.
- Agree acceptance criteria before implementation.
- Review and test before committing.
- Use complete, bounded functional work packages with explicit completion criteria; use statement-by-statement coaching only when requested or needed.
- Preserve the agreed test scope and regression protection; do not optimize for test count or delay delivery for optional test refactors.
- New publication blockers require a concrete defect and impact; optional review comments do not require extra correction rounds.
- Prefer explicit understandable code over unnecessary abstraction.
- Reuse existing business rules.
- Keep source code, Git history, `AGENTS.md` and this log synchronized.
- Separate blockers from optional improvements.
- Do not allow endless polishing to delay the portfolio publication milestone.

## 14. Immediate next action

1. TASK 005E.1 is complete with 74 passing tests and a successful build.
2. The owner handles any documentation amendment and push of the completed work.
3. TASK 005E.2 is complete with 93 passing tests and a successful build; commit and push its code, tests and documentation together.
4. Implement TASK 006 minimal UI and manually verify its main flow, targeting completion on 2026-10-13.
5. Complete TASK 005F: CI, concise README, risk/evidence map and final publication checks.
6. Prepare hosting and publish the repository and website demo after the minimal UI is ready.
7. Verify the deployed booking flow and use the project on LinkedIn/CV.
8. Continue with Playwright and further development publicly.
