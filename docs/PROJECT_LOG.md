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
- `b8558c7` — `WIP: TASK 004 user permissions` (adds `roomExists()` and tests)
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

At TASK 005 completion, `isBooking()` intentionally validated structure and primitive types only. TASK 005E.2 later added semantic validation.

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
- TypeScript strict checking passing (historical report; the 2026-10-13 audit found that current tsconfig does not enable `strict`, so this is not current verification),
- clean working tree,
- local `main` aligned with `origin/main`.

## 5. Portfolio decisions and working method

### Strategy change — 2026-10-12

The owner began an active job search. The initial finish-everything-before-publication approach was replaced by a bounded, credible portfolio milestone, followed by continued public development while applying for jobs.

The first plan placed minimal UI after publication. This ordering was superseded on 2026-10-13.

### UI before publication — 2026-10-13

The owner chose to finish the minimal UI before publishing the repository and website, so the LinkedIn presentation can include a usable demo. The agreed order became:

`005E.1 date validation -> 005E.2 storage validation -> 006 minimal UI -> 005F CI/README/evidence -> publication -> 007 Playwright -> 008 case study`

The same-day UI target was a delivery goal, not a reason to omit essential checks. TASK 006 is now implemented locally and manually checked as reported below. Task numbers are retained.

A public GitHub repository and a hosted website are separate deliverables. Hosting has not been selected or verified in this audit. Job applications need not wait for further features or the full case study.

### Working method and AI attribution

- Work in complete, bounded functional packages with a review after implementation; explain individual statements when requested or needed.
- Keep test scope tied to agreed rules and concrete risks. Optional parameterization, naming cleanup and speculative edge cases must not delay publication.
- Codex runs tests directly. Build evidence may come from an actual Codex run or owner output; successful checks need not be repeated without a relevant change.
- The owner normally implements JS/TS and tests with AI guidance, and handles Git. Documentation may accompany related code commits.
- The owner explicitly delegated HTML/CSS and visual assets to Codex. AI also provided mentoring, test/design suggestions, debugging, code examples, review and documentation.
- README attribution must describe those actual contributions, including AI implementation of the visual UI. Avoid implying fully independent implementation or review-only AI support.

## 6. Historical audit findings and their resolution

The post-TASK-005 audit identified concrete gaps outside the original TASK 005 contract:

| Finding | Risk | Resolution |
| --- | --- | --- |
| Booking date was an unchecked string | Impossible or inconsistent dates could be created | TASK 005E.1 added calendar validation and INVALID_DATE |
| Stored `9:00` passed structural checks | Lexical overlap comparisons assumed `HH:mm` and could miss a collision | TASK 005E.2 reuses timeValidation during loading |
| Numeric IDs had no semantic contract or uniqueness check | Fractional/negative/unsafe or duplicate IDs could corrupt identity assumptions | TASK 005E.2 checks positive safe integers and unique booking IDs |

These are resolved findings, not remaining publication blockers. Preserve the stored-time defect as a portfolio example:

`stored 9:00–10:00 -> requested 09:30–10:30 -> previously missed overlap -> reject invalid stored time before use`

Current regression tests prove that the loader rejects malformed stored times. They are not an automated browser reproduction of the entire original collision scenario. No UUID migration or general data-migration system was introduced.

## 7. Completed task — TASK 005E.1

Status: Completed, verified and committed.

Commit:
`9ac1931` — `feat: validate booking dates before creation`

The earlier reference `aea6a92` was the pre-amendment commit. Use `9ac1931` for current Git history.

Implemented:
- exact four-digit `YYYY-MM-DD`; reject empty/malformed/whitespace values,
- month/day ranges and month lengths,
- Gregorian leap-year rules, including 1900 rejection and 2000 acceptance,
- INVALID_DATE in CreateBookingResult,
- date validation after time validation and before overlap,
- no future-only rule, minimum year or booking horizon.

Historical completion evidence on 2026-10-13:
- 74/74 Vitest tests passed,
- owner supplied successful TypeScript/Vite build output.

The committed creation regression test uses `2026-02-30`. Earlier documentation incorrectly described it as using an invalid-format string; the date has valid format but is impossible.

## 8. Completed task — TASK 005E.2

Status: Completed, verified and committed.

Commit:
`12228e7` — `feat: validate stored booking semantics and unique IDs`

Implemented:
- structural checks before business validators,
- stored dates/times reuse dateValidation/timeValidation,
- id, roomId and userId must be positive safe integers,
- duplicate booking IDs rejected; shared room/user IDs allowed,
- malformed/invalid stored data preserved,
- loader remains independent of createBooking and current-user permissions.

Historical completion evidence on 2026-10-13:
- 93/93 tests across two files passed,
- owner supplied successful TypeScript/Vite build output.

Tests include invalid stored dates and time formats, reversed valid-format times, invalid values for all three identifier fields, duplicate booking IDs, valid multiple bookings and no write/delete/clear on semantic failure.

## 9. Completed local task — TASK 006

Status: Implemented and reviewed in the working tree. The owner reported successful manual acceptance checks. Not yet committed or published as of the 2026-10-13 audit.

### Verified source scope

- UI is initialized before querying its form/list elements.
- Fixed demo identity: Alice, id 1, role booker.
- Fixed room catalog: Room A/id 1/capacity 4 and Room B/id 2/capacity 8.
- Labeled required room/date/time fields, native date/time controls and same-day guidance.
- Startup load through loadBookings; successful results populate the in-memory list and render cards.
- Cards clone a template and populate textContent, date/time and booking ID; unknown stored room references show a room-ID fallback.
- Empty list has an empty state. Read failure hides it, displays an error and prevents creation through both disabled submit and a handler guard.
- Submit prevents the default reload, reads FormData and calls createBooking.
- All five creation failure codes have readable messages; validation failure exits before saving.
- Successful creation builds a new array and calls saveBookings before updating in-memory state or rendering.
- Failed writes display an error and do not update the in-memory/displayed list.
- Responsive styling, focus indication, live status/error containers, demo/local-storage notices, page metadata and a custom SVG favicon are present.

Architecture: main.ts coordinates UI and state; validation/booking creation and persistence remain in their existing modules. No new framework, backend or dependency was added.

The initial static UI had disabled submit and no connected behavior. That intermediate description is superseded: submit is now enabled after a successful initial load. Empty/read/write error paths were inspected in source; not all were manually exercised.

### Manual acceptance evidence

Source: the owner's statement in this conversation on 2026-10-13 that all requested cases passed. Codex did not independently operate the browser or capture screenshots/traces.

Using the same date with no prior conflicting bookings:

| Manual check | Owner-reported result |
| --- | --- |
| Room A, 09:00–10:00 -> card and success message | Passed |
| Refresh -> created booking still shown | Passed |
| Room A, 09:30–10:30 -> overlap rejected, no new card | Passed |
| Room A, 10:00–11:00 -> touching boundary accepted | Passed |
| Room B, 09:00–10:00 -> same time in another room accepted | Passed |
| 12:00–11:00 -> invalid time message | Passed |
| Narrow window and keyboard Tab navigation | Passed |

Browser/version, exact viewport, test date and screenshots were not supplied. This is a manual smoke check, not a cross-browser/accessibility certification or automated E2E run. UI storage-error flows were reviewed in code but have no owner-reported browser check; module exceptions are covered by mocked storage tests.

### Current automated verification

During the documentation audit on 2026-10-13, Codex reran:
- `npm run test:run`: **93/93 passed, two test files**.
- `npm run build`: **passed**, TypeScript followed by Vite 8.3.0.

These results apply to the local working tree containing TASK 006, not a CI or deployed version. No application/test changes were made during this documentation audit, and no new tests were added for the UI.

## 10. Current architecture, tests and limitations

### Responsibilities

| Location | Responsibility |
| --- | --- |
| src/models/ | Booking, input/result unions, Room and User interfaces |
| src/validation/bookingValidator.ts | Time/date/permission/room/overlap rules and booking creation |
| src/storage/bookingStorage.ts | Runtime validation and full-list JSON reads/writes under slotledger.bookings |
| src/main.ts | Markup, demo fixtures, DOM rendering, startup load, form orchestration and messages |
| src/style.css, index.html, public/slotledger.svg | Presentation, responsive layout, metadata and icon |

Creation validation order is permission -> room existence -> time -> date -> overlap. Failure codes are NO_PERMISSION, ROOM_NOT_FOUND, INVALID_TIME, INVALID_DATE and ROOM_OVERLAP. Creation does not mutate its supplied list; ID is highest existing booking ID + 1, userId comes from the user, and createdAt is an ISO timestamp.

### Existing automated tests

| Test file | Cases | Coverage |
| --- | --- | --- |
| src/validation/bookingValidator.test.ts | 58 | Time/date rules, permissions, room existence, overlap boundaries, creation failures/success, ID generation, controlled timestamp and non-mutation |
| src/storage/bookingStorage.test.ts | 35 | Missing/valid/invalid data, structural/semantic validation, IDs and duplicates, read/write exceptions, serialization and preservation |
| Total | 93 | Vitest tests; parameterized cases counted individually |

Storage tests stub localStorage; timestamp tests use a controlled clock. There are no main.ts/DOM tests, Playwright files or browser E2E tests. No coverage percentage was measured. The permission rule has unit coverage, but the current UI does not offer a viewer role.

Current tsconfig includes unused-code checks and other compiler options, but does not enable `strict`. A historical audit reported strict checking; the checked-in configuration does not substantiate that claim. The successful build proves compilation under current options. Changing compiler mode is outside this documentation task.

### Deliberate limitations

- Browser-local data, fixed demo user/rooms, no login, backend, shared database or synchronization.
- No edit/delete workflow, room-management UI or multi-tab concurrency handling.
- No booking-horizon or future-only rule. Calendar-valid historical dates such as 0001-08-29 are not rejected solely for being old; adding a range requires a separate business decision.
- Dates use a four-digit year and times use same-day HH:mm. The domain validator does not separately reject year 0000; no minimum-year contract or regression test for it is defined.
- Storage checks semantics needed by the application; it does not re-check overlaps/current room membership or validate the createdAt string as a timestamp.
- Automated UI/E2E and deployment evidence are still missing; there is no claim of production readiness.

These limitations are not automatic reasons to expand the pre-publication scope. A new blocker must identify a concrete defect affecting the agreed demo.

## 11. Publication-readiness audit — 2026-10-13

The only existing project Markdown documents are AGENTS.md and this log. No README, separate architecture document or QA evidence map exists to synchronize. Creating those portfolio deliverables belongs to TASK 005F, which was not implemented in this audit.

Git and GitHub were checked read-only:
- Local branch: main; HEAD and local origin/main: `12228e7b89790340e3153763701d7b3a9abfc97b`.
- GitHub main API returned the same commit.
- GitHub repository metadata reports **private**.
- TASK 006 changes remain local: main.ts, style.css, index.html and untracked public/slotledger.svg, plus documentation.
- Public/favicon.svg remains tracked but is no longer referenced by index.html. Removing that unused starter asset is optional cleanup.

| Deliverable | Verified status |
| --- | --- |
| Date and storage validation | Completed and committed |
| Minimal UI | Implemented locally; owner-reported manual checks passed; commit pending |
| Local tests/build | Passed during this audit |
| GitHub Actions CI | No .github/workflows in checkout or current committed tree; GitHub Actions runs API returned total_count: 0 |
| README | Absent |
| Concise recruiter-facing risk/evidence map | Absent; planned in TASK 005F |
| Playwright | No dependency, script, configuration or tests |
| Repository visibility | Private |
| Hosting / live URL | No deployment configuration or verified live URL in the inspected project/session; hosting choice pending |
| Fresh-install verification | Lockfile exists; npm ci was not run during this audit |
| Publication content/security review | .gitignore excludes dependencies, build output, environment files and test reports; full tracked-file/history secret review is not yet evidenced |

GitHub reads used the connected GitHub tool for repository metadata, main branch and Actions runs. No remote mutation, visibility change, commit or push was performed.

Corrections applied to documentation:
- Replace stale instructions to implement TASK 006 with its actual completed local scope.
- Record TASK 005E.2 as committed at 12228e7, not awaiting commit.
- Replace the superseded date-validation commit reference with 9ac1931.
- Correct the date-creation test input description to match code.
- Keep original TASK 005 structural-validation behavior explicitly historical.
- Remove strict-mode claims from current verification.
- Preserve the UI-before-publication decision and distinguish manual checks from automated evidence.

## 12. Next task — TASK 005F: Portfolio foundation

Status: Next, not implemented.

Bounded scope:
1. Have the owner commit the verified TASK 006 implementation and synchronized documentation.
2. Add a simple GitHub Actions workflow for pushes to main and pull requests, running npm ci -> npm run test:run -> npm run build with one explicitly selected Node version compatible with the lockfile.
3. Add a concise English README for recruiters: purpose, working UI, stack, install/run/test commands, rules, architecture, evidence, limitations, AI contribution and roadmap.
4. Add a small rule -> risk -> test level -> evidence map in README or a short document. Link real unit/CI evidence and identify manual UI checks as manual.
5. Verify the actual CI run; do not infer CI success from local checks.
6. Complete the tracked-file/history and publication-content review.
7. Select static hosting, prepare the build for its serving URL, publish the repository/demo and verify the main flow at the deployed URL before promoting that link.

Repository visibility changes and website deployment follow the owner's authorization/Git workflow. Package.json `private: true` prevents accidental npm package publication; it does not set GitHub visibility.

No new dependency, extra UI feature, general migration layer, coverage target or speculative date rule is required for this milestone. Optional refactors must not delay publication or job applications.

## 13. Development after publication

### TASK 007 — Playwright E2E

Status: Planned, not installed or implemented. Begin immediately after publication; it does not block the first public demo.

First flow: `create booking -> booking appears -> refresh -> booking persists`.

Then cover overlap rejection and relevant failure paths. Use role/label locators, web-first assertions and useful failure traces/screenshots, without artificial sleeps. Viewer E2E requires an agreed way to choose a viewer identity; the current UI always uses a booker.

### TASK 008 — QA Release Check case study

Status: Planned.

Prepare risk-based scope, release checklist, known limitations, controlled defect examples, regression evidence and a go/no-go report suitable for portfolio discussion.

Preferred evidence chain:

`business risk -> test -> discovered defect -> root cause -> fix -> regression protection -> CI evidence`

The stored-time-format issue remains a candidate; do not claim an automated E2E reproduction until one exists.

## 14. Deferred cleanup

Optional after publication: test-name/format cleanup, fixture deduplication or parameterization, storage-key constant, extraction of creation/UI code if it grows, unused starter favicon removal, and coverage reporting.

Do not reopen completed tasks or extend the first release for these items. Detailed decisions and historical results stay here; AGENTS.md remains a concise set of current instructions.
