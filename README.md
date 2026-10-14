# SlotLedger

A TypeScript room-booking demo built as a **QA Engineer / QA Automation Engineer portfolio project**. It combines a working browser interface with explicit business rules, runtime data validation and regression tests.

I am building SlotLedger to demonstrate how I connect booking risks to test cases, investigate defects and keep application behavior verifiable. The project shows TypeScript domain modeling, boundary testing with Vitest, controlled clocks, storage mocks and separation of UI, validation and persistence.

**Current status:** the minimal booking UI is implemented and committed. Local tests and build pass. I have prepared a GitHub Actions workflow and GitHub Pages configuration locally; the first CI run and live deployment are still pending. Playwright E2E tests will follow publication.

## What works

- Create a booking for Room A or Room B using native date and time controls.
- Display saved bookings and restore them after a page refresh.
- Reject overlapping bookings for the same room and date while allowing back-to-back bookings.
- Validate real calendar dates, same-day time ranges and booking permissions through reusable TypeScript functions.
- Validate data loaded from `localStorage`, including identifiers and duplicate booking IDs.
- Show readable validation/storage errors. A failed initial read prevents new bookings; a failed save does not add an unsaved booking to the list.

The interface uses a fixed demo user, Alice, with the `booker` role. Bookings are stored only in the current browser under `slotledger.bookings`.

## Run locally

Use **Node.js 22.x, version 22.12 or newer**, with npm, matching the supported range of the locked tooling. Local verification used Node.js 22.14.0.

```bash
git clone https://github.com/MattZurr/slotledger-qa-demo.git
cd slotledger-qa-demo
npm ci
npm run dev
```

Open the local URL printed by Vite. No backend or environment variables are required. Repository access is required while it remains private.

```bash
npm run test:run  # Run all Vitest tests once
npm run test      # Watch mode during development
npm run build    # TypeScript check, then Vite build into dist/
npm run preview  # Serve an existing build locally
```

## QA approach and evidence

Tests focus on business boundaries and data consistency. The suite exercises both individual validators and their use in booking creation/storage loading. Storage is mocked; timestamp assertions use a controlled clock.

| Business rule | Risk | Existing test evidence |
| --- | --- | --- |
| A room cannot have overlapping bookings on the same date | Double booking | [Vitest validation tests](src/validation/bookingValidator.test.ts): partial overlap, containment, identical ranges, touching boundaries, different rooms/dates |
| Times must use `HH:mm`, with end after start on the same day | Invalid duration or incorrect time comparisons | [Vitest validation tests](src/validation/bookingValidator.test.ts): malformed/out-of-range times, equal/reversed times, midnight crossing and minute boundaries |
| Dates must use `YYYY-MM-DD` and exist in the calendar | Impossible dates entering the booking list | [Vitest validation tests](src/validation/bookingValidator.test.ts): format, whitespace, month/day limits, leap years including 1900/2000, and `INVALID_DATE` from creation |
| Only a booker may create a booking, and the room must exist | Disallowed booking creation or invalid room reference | [Vitest validation tests](src/validation/bookingValidator.test.ts): viewer rejection, missing room and empty room catalog |
| Booking creation assigns identity/timestamp without changing its input list | Incorrect metadata or accidental state mutation | [Vitest creation tests](src/validation/bookingValidator.test.ts): empty/unsorted/gapped IDs, current user ID, fixed timestamp and unchanged input list |
| Loaded data must satisfy the application's format and identity assumptions | Corrupted state or missed collisions | [Vitest storage tests](src/storage/bookingStorage.test.ts): structural/semantic rejection, positive safe integer IDs and duplicate booking IDs |
| Invalid stored data must be preserved and access failures reported | Silent data loss or unreported persistence failure | [Vitest storage tests](src/storage/bookingStorage.test.ts): malformed JSON, no write/delete/clear on validation failure, read/write exceptions and JSON serialization |

**Latest local verification — 2026-10-14, application commit `87f9c3b` with local publication configuration:** 93/93 tests passed across two files (58 validation/creation cases and 35 storage cases); `npm run build` passed. Built JS, CSS and favicon paths use `/slotledger-qa-demo/`. These are local results; no CI run or live deployment has been verified.

I also completed manual UI smoke checks: create → display → refresh → persists, overlap rejection, touching boundaries, a different room, reversed times, narrow layout and Tab navigation. These checks are recorded in the [project log](docs/PROJECT_LOG.md#manual-acceptance-evidence). The Vitest suite does not exercise the browser UI; automated E2E, cross-browser coverage and UI storage-failure checks remain future work.

### Defect example: stored time format

An audit found that structural storage validation accepted `9:00`, while overlap logic relied on fixed-width `HH:mm` comparisons. That mismatch could allow a collision to be missed. The loader now reuses `timeValidation()` and rejects the invalid stored value. The [storage regression test for invalid time formats](https://github.com/MattZurr/slotledger-qa-demo/blob/87f9c3b61415e93961309b558079d764e2319941/src/storage/bookingStorage.test.ts#L210-L231) protects that contract; the complete browser scenario is not yet automated.

## Stack and architecture

TypeScript 6, Vite 8, Vitest 5, HTML/CSS and browser `localStorage`. No application framework or backend.

| Location | Responsibility |
| --- | --- |
| [`src/models/`](src/models/) | Booking, room and user types; explicit success/failure result unions |
| [`src/validation/bookingValidator.ts`](src/validation/bookingValidator.ts) | Business validators and booking creation |
| [`src/storage/bookingStorage.ts`](src/storage/bookingStorage.ts) | Runtime validation, JSON loading and full-list saving |
| [`src/main.ts`](src/main.ts) | Demo data, DOM rendering, startup loading and form orchestration |
| [`src/style.css`](src/style.css) | Responsive layout and visual states |

The submit flow is **form → `createBooking()` → `saveBookings()` → update state and render**. Business validation returns explicit error codes rather than handling UI messages or persistence. On load, runtime checks protect business assumptions that TypeScript types alone cannot enforce on stored JSON.

Strict type checking is effective with the locked TypeScript 6.0.3 compiler; its [effective options were verified](docs/PROJECT_LOG.md#typescript-strict-verification).

## Current limitations

- Educational, single-browser demo: no authentication, backend, shared availability or synchronization across devices/tabs. The role rule is application logic, not a security boundary.
- Fixed demo user and room catalog; no role switch, booking edit/delete or room management.
- Same-day bookings only. Past dates are permitted; a future-only policy or booking horizon has not been defined.
- Storage validation checks individual records and booking-ID uniqueness. It does not re-check all stored overlaps, current room membership or timestamp semantics.
- Automated tests cover business logic and mocked storage. Browser E2E is not implemented; CI and deployment verification are pending.

## Roadmap

1. **Portfolio foundation — in progress:** this README, risk/evidence map and [GitHub Actions workflow](.github/workflows/ci-pages.yml) are prepared. The workflow runs `npm ci`, tests and build on pushes to `main` and pull requests using Node.js 22; I still need to verify its first actual run.
2. **First public release — planned:** publish the repository and deploy the static demo on free GitHub Pages. Deployment runs only from `main` after successful tests/build; I will verify create → display → refresh at the live URL before sharing it.
3. **Playwright E2E — planned after publication:** automate create → display → refresh → persists, followed by overlap rejection and relevant failure paths.
4. **QA Release Check — planned:** risk-based release scope, defect/regression evidence, known limitations and a documented go/no-go recommendation.

My first publication milestone is a public repository, this README, verified CI and a working GitHub Pages demo. I am preparing this portfolio for QA roles and will continue developing it during my job search.

### Development approach

I implemented the TypeScript booking logic and unit tests, using AI tools for technical guidance, feedback, and code review. AI also helped create the HTML/CSS interface and visual assets.
