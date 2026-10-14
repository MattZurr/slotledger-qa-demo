# SlotLedger — Codex Instructions

## Purpose and current status

SlotLedger is an educational TypeScript room-booking application and QA Automation portfolio project. The owner is preparing for a job change and plans to start actively sending applications on 2026-10-19 or 2026-10-20. TASK 005F and public publication are complete. Until Monday, prioritize focused development within TASK 007, then TASK 008 as time permits.

Current stack: TypeScript, Vite, HTML/CSS, Vitest, Playwright, browser localStorage, Git and GitHub. No application framework, backend or database.

Current status as of 2026-10-14:
- TASK 005E.1 date validation and TASK 005E.2 semantic storage validation are completed and committed.
- TASK 006 minimal UI is implemented, reviewed and pushed. Its equivalent commit after the authorized email rewrite is 87f9c3b; the rewritten history and TASK 005F preparation were pushed by the owner at 5fec675. The owner reported successful manual checks of the main flows, narrow layout and keyboard navigation.
- Codex ran `npm run test:run`: 93/93 tests passed across two files.
- Codex ran `npm run build`: TypeScript/Vite build passed.
- Detailed history, commit references and evidence limits belong in [docs/PROJECT_LOG.md](docs/PROJECT_LOG.md).
- TASK 005F is completed: public repository, live Pages demo, professional README/risk map and screenshot are committed/pushed through 442c9d3. Final workflow run 38577175482 passed npm ci, 93 tests, build and deployment.
- TASK 007A initial suite is verified locally: seven owner-written Chromium tests in e2e/booking.spec.ts passed on 2026-10-14, covering creation/persistence, overlap rejection, reversed/equal times, touching boundaries and different rooms/dates. Vitest 93/93 and build also passed. E2E is not integrated into CI.
- With explicit owner approval, the original repository was retained as private slotledger-qa-demo-private-archive and independent slotledger-qa-demo (ID 1418948555) was made public. Pages uses GitHub Actions; the github-pages environment allows only the main branch. The owner approved publication and deployment; do not request that approval again for this agreed workflow.
- Anonymous GitHub API verified 23 noreply commits, unavailability of all 22 original SHAs in the public repository and unavailability of the private archive. Keep the archive private. Repository: https://github.com/MattZurr/slotledger-qa-demo ; live demo: https://mattzurr.github.io/slotledger-qa-demo/ .
- Codex verified the deployed create -> display -> refresh -> persists flow in an isolated Chrome profile (one-off CDP smoke check), and HTTP 200 for JS, CSS and favicon. This is separate from Vitest, earlier owner manual checks and the maintained local Playwright suite; details are in PROJECT_LOG.md.
- npm audit reported one high finding in transitive development dependency source-map-js 1.2.1. Its patch update remains unapproved; Playwright installation was approved separately. The build-tooling risk assessment is in PROJECT_LOG.md.

Next step: continue TASK 007 with the owner-written recovery scenario (invalid time -> correct end time -> successful booking -> previous error disappears), deferred to the next session. Then integrate E2E into CI and publish its evidence. Playwright setup and normal runs are already authorized. Stop the owner's Playwright UI before a separate run: both use port 4173. Git commits/push remain owner-controlled. Do not reopen publication or repeat successful checks without a relevant change or concern.

## Working style and authorization

1. Respond in Polish unless asked otherwise.
2. Act as a programming mentor and code reviewer. Use practical SlotLedger examples and understandable code.
3. Give complete, bounded functional tasks with clear completion criteria. Explain statement by statement when the owner asks or needs help.
4. Give hints before full JS/TS solutions and let the owner implement whenever practical.
5. The owner explicitly delegated HTML/CSS and visual assets to Codex, including direct edits and complete solutions. Involve the owner in JS/TS behavior and business integration.
6. Modify other files only when asked. Documentation updates may be made within an explicitly authorized documentation task.
7. Do not create commits, push or install dependencies without explicit permission. The owner normally handles Git for practice; documentation can accompany related code in the same commit.
8. Do not introduce a framework, backend, database or dependency without an agreed need and owner approval.
9. Before proposing the next task, read PROJECT_LOG.md and inspect the repository state. Report disagreements among code, Git history and documentation rather than guessing.
10. Preserve agreed behavior. Keep requirements bounded; optional review comments do not require extra correction rounds.
11. Test concrete risks and agreed boundaries, not a target test count. Parameterization and test cleanup are optional when they do not improve correctness.
12. Update docs/PROJECT_LOG.md after completing a bounded task (for example TASK 006 or TASK 007A), not after each instruction, edit or test run. Keep interim progress in the conversation; include related log changes in the task's final commit.

## Architecture and contracts to preserve

- `src/models/`: domain interfaces and result unions.
- `src/validation/bookingValidator.ts`: time/date validation, permission, room existence, overlap and booking creation.
- `src/storage/bookingStorage.ts`: runtime validation and localStorage reads/writes.
- `src/main.ts`: UI markup, demo fixtures, rendering, startup loading and submit orchestration.
- `src/style.css`, `index.html`, `public/slotledger.svg`: presentation and metadata.
- Business rules stay outside UI orchestration; persistence is a separate operation.

Booking rules:
- Exact `HH:mm`, hours 00–23, minutes 00–59; end must be later on the same day.
- Exact four-digit `YYYY-MM-DD`, valid month/day combinations and Gregorian leap-year rules.
- No future-only rule, minimum year or booking horizon has been agreed. Do not add one for unusual but valid historical dates.
- Only bookers may create; the room must exist.
- Overlap compares the same room and date; touching boundaries are allowed.
- Creation order: permission -> room -> time -> date -> overlap.
- Failure codes: NO_PERMISSION, ROOM_NOT_FOUND, INVALID_TIME, INVALID_DATE, ROOM_OVERLAP.
- Creation uses the current user ID, highest existing booking ID + 1, and an ISO timestamp; it does not mutate the supplied list.

Storage:
- Key: `slotledger.bookings`; missing key returns an empty list.
- Validate structure, date/time semantics, positive safe integer id/roomId/userId, and unique booking IDs.
- Invalid JSON/data returns INVALID_STORED_DATA; read/write exceptions return STORAGE_READ_ERROR/STORAGE_WRITE_ERROR.
- Failed reads preserve stored data. Loading does not call createBooking or re-check permissions.
- Do not introduce migrations or additional stored-data business constraints without discussion.

UI:
- Fixed demo user Alice (booker), rooms A/B, native date/time fields and browser-local persistence.
- Render booking cards from a template with textContent; allow a room-ID fallback for older stored room references.
- A read failure hides the empty state, shows an error and prevents creation.
- A successful creation is saved before updating the in-memory list, rendering or reporting success.
- A failed write leaves the displayed/in-memory list unchanged.
- Login, role switching, edit/delete, custom calendar widgets and extra UI features are outside the first publication milestone.

## Reviews and verification

Read implementation and relevant tests. Check correctness, types, responsibilities and whether tests actually detect their claimed behavior. Reuse validators instead of duplicating rules.

Classify recommendations:
- **Blocking before publication:** a concrete defect affecting the agreed flow/data, a misleading evidence claim, or a missing agreed publication deliverable.
- **Valuable after publication:** Playwright, broader regression evidence and useful features.
- **Optional refactor:** formatting, fixture deduplication, module extraction, constants and test-name cleanup.

Codex runs `npm run test:run` directly; do not ask the owner to paste test output. Before closing an implementation task, also verify `npm run build` using an actual Codex or owner result. If a build result is missing, ask the owner to run it. Do not repeat successful checks without a relevant change or unresolved concern.

Separate automated tests, source review, owner-reported manual checks and deployment verification. The current Vitest suite covers business rules and mocked storage, not browser UI/E2E. A passing build does not verify DOM behavior. Effective strict checking is verified for TypeScript 6.0.3: `tsc --showConfig` omits the explicit flag, but the compiler API confirms strict options are true. Do not infer defaults solely from absent config entries; recheck effective options when compiler/config changes.

## Publication roadmap

Completed: TASK 005E.1 -> TASK 005E.2 -> TASK 006 -> TASK 005F -> public repository and hosted demo.
Remaining: TASK 007 -> TASK 008. Task numbers reflect history, not current execution order.

TASK 005F publication deliverables are complete:
- Prepared workflow: `npm ci` -> `npm run test:run` -> `npm run build`, on pushes to main and pull requests, with Node.js 22. Pages deployment depends on successful verification and runs only on main pushes or manual main runs; PR jobs have no deployment permissions.
- Review and commit the prepared recruiter-oriented README and its business-rule -> risk -> test-evidence map with the owner; keep claims synchronized with actual local/CI/deployment results.
- Verify the actual CI run and link its evidence. No badge implying successful CI before a successful run exists.
- Review tracked files/history for secrets and local-only content; do not claim this is complete merely because .gitignore exists.
- Use free GitHub Pages for the public repository, with Vite base `/slotledger-qa-demo/`. After owner approval, configure Pages source as GitHub Actions, deploy and verify create -> display -> refresh at the actual URL.
- Repository visibility and website hosting are separate deliverables. Publication follows the owner's Git/approval workflow.

The minimum first release is a public GitHub repository, professional README/risk map, verified basic CI and a working free GitHub Pages demo. Until 2026-10-19, focus on project development; after publication, use the remaining time for TASK 007, then TASK 008 as time permits. Active applications are planned for 2026-10-19 or 2026-10-20 and do not depend on completing the entire roadmap. Do not expand the publication scope with optional refactors, coverage tooling, extra date rules or elaborate styling.

TASK 007 follows publication: first automate create -> display -> refresh -> persists with Playwright, then overlap and relevant errors. Use role/label locators, web-first assertions and no artificial sleeps. Viewer E2E requires a deliberate way to select that role; the current UI only exposes a booker.

TASK 008: QA Release Check case study, risk-based scope, regression/defect evidence and go/no-go report.

## Honest portfolio attribution

README should briefly describe actual AI contributions: mentoring, design/test-scenario suggestions, debugging, code review, code examples and documentation, plus direct implementation of HTML/CSS and visual assets. The owner implements application logic/tests with guidance and decides what to include. Update attribution if responsibilities change; avoid claims of full independent authorship, review-only AI use, per-test labels or authorship percentages.
