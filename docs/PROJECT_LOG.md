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

Commit references in this log use the equivalent IDs after the authorized email-only history rewrite on 2026-10-14. Historical push and remote-audit statements describe the original equivalent commits. The owner subsequently pushed the rewritten history at 5fec675; see the email-privacy and first remote-verification updates in section 12.

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

`70b0866` — `feat: add booking domain models`

Initial models:
- `Booking`
- `CreateBookingInput`
- `Room`
- `User`

The model layer was later extended with result unions for booking creation and storage operations.

### TASK 002 — Booking time validation

Status: Completed and committed.

Commit:

`2ad8df0` — `feat: complete booking time validation`

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

`4c170a6` — `test: add booking time validation tests`

Completed:
- configured Vitest,
- added initial time-validation tests,
- used a controlled mutation to confirm that an important regression test actually detected a defect.

### TASK 004 — Additional booking rules

Status: Completed and committed.

Relevant commits:
- `507be02` — `feat: validate user booking permissions`
- `090f030` — `WIP: TASK 004 user permissions` (adds `roomExists()` and tests)
- `8e52aa0` — `feat: complete booking overlap validation and prepare TASK 005`

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
- `362e449` — `WIP: start booking creation implementation`
- `b176140` — `WIP: record TASK 005 contract and booking creation sketch`
- `a60b88a` — `WIP: add booking creation result and first success test`
- `a595e7c` — `feat: complete TASK 005B booking creation validation`
- `5810496` — `feat: complete booking ID and timestamp generation`
- `1cb005f` — `feat: add local booking persistence with validation and tests`

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

`1cb005f` — `feat: add local booking persistence with validation and tests`

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
- TypeScript strict checking passing (historical report; effective strict options were independently verified with TypeScript 6.0.3 during TASK 005F, see section 12),
- clean working tree,
- local `main` aligned with `origin/main`.

## 5. Portfolio decisions and working method

### Strategy change — 2026-10-12

The owner began an active job search. The initial finish-everything-before-publication approach was replaced by a bounded, credible portfolio milestone, followed by continued public development while applying for jobs.

The first plan placed minimal UI after publication. This ordering was superseded on 2026-10-13.

### UI before publication — 2026-10-13

The owner chose to finish the minimal UI before publishing the repository and website, so the LinkedIn presentation can include a usable demo. The agreed order became:

`005E.1 date validation -> 005E.2 storage validation -> 006 minimal UI -> 005F CI/README/evidence -> publication -> 007 Playwright -> 008 case study`

The same-day UI target was a delivery goal, not a reason to omit essential checks. TASK 006 is completed, manually checked as reported below, and committed/pushed at 87f9c3b. Task numbers are retained.

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
`c3e73a3` — `feat: validate booking dates before creation`

An earlier reference identified the pre-amendment commit. Use `c3e73a3` for current local Git history after the email rewrite.

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
`633a662` — `feat: validate stored booking semantics and unique IDs`

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

## 9. Completed task — TASK 006

Status: Implemented, reviewed, committed and pushed. The owner reported successful manual acceptance checks. The repository remains private and a hosted demo has not been verified.

Commit: `87f9c3b` — `feat: add minimal room booking UI with local persistence`. The TASK 005F audit confirmed that local HEAD, origin/main and GitHub main all point to this commit.

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

### Automated verification at TASK 006 completion

During the documentation audit on 2026-10-13, Codex reran:
- `npm run test:run`: **93/93 passed, two test files**.
- `npm run build`: **passed**, TypeScript followed by Vite 8.3.0.

Those results applied to the then-uncommitted TASK 006 working tree. The owner subsequently committed/pushed it at 87f9c3b. Tests and build were rerun successfully against that commit during TASK 005F (section 12). Neither verification was a CI or deployed run. No new tests were added for the UI.

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

Effective strict type checking is enabled by the locked TypeScript 6.0.3 compiler defaults. Neither tsconfig nor `tsc --showConfig` explicitly prints the strict flag; the compiler API confirmed the effective strict options (section 12). The earlier conclusion that strict was disabled relied only on a missing explicit entry and was incorrect. No compiler/configuration change was needed or made.

### Deliberate limitations

- Browser-local data, fixed demo user/rooms, no login, backend, shared database or synchronization.
- No edit/delete workflow, room-management UI or multi-tab concurrency handling.
- No booking-horizon or future-only rule. Calendar-valid historical dates such as 0001-08-29 are not rejected solely for being old; adding a range requires a separate business decision.
- Dates use a four-digit year and times use same-day HH:mm. The domain validator does not separately reject year 0000; no minimum-year contract or regression test for it is defined.
- Storage checks semantics needed by the application; it does not re-check overlaps/current room membership or validate the createdAt string as a timestamp.
- Automated UI/E2E and deployment evidence are still missing; there is no claim of production readiness.

These limitations are not automatic reasons to expand the pre-publication scope. A new blocker must identify a concrete defect affecting the agreed demo.

## 11. Historical publication-readiness audit — 2026-10-13, before TASK 006 commit

At the time of this audit, the only project Markdown documents were AGENTS.md and this log. README and the portfolio risk/evidence map were still planned. This section preserves that snapshot; section 12 records the subsequent TASK 006 commit and README preparation.

Git and GitHub were checked read-only:
- Local branch: main; HEAD and local origin/main: `633a6629273bd20bdf9117add70b051fb1a808e5`.
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
- Record TASK 005E.2 as committed at 633a662, not awaiting commit.
- Replace the superseded date-validation commit reference with c3e73a3.
- Correct the date-creation test input description to match code.
- Keep original TASK 005 structural-validation behavior explicitly historical.
- Temporarily remove strict-mode claims based on absence of an explicit config flag; this reasoning was later corrected by effective compiler verification in section 12.
- Preserve the UI-before-publication decision and distinguish manual checks from automated evidence.

## 12. Current task — TASK 005F: Portfolio foundation

Status: Publication implemented and verified at 5fec675. The independent repository is public, GitHub Pages is live, and workflow 38573433621 passed installation, 93 tests, build and deployment. Anonymous privacy checks and the deployed create -> display -> refresh smoke check passed. Final documentation/screenshot synchronization awaits the owner's commit/push to close TASK 005F. See the 2026-10-14 updates below.

### Repository and evidence verification — 2026-10-13

- Clean working tree at audit start; local main and origin/main both at `87f9c3b61415e93961309b558079d764e2319941`.
- GitHub main API returned the same commit; repository metadata still reports private.
- Reviewed source confirms the completed TASK 006 flow described in section 9.
- `npm run test:run`: 93/93 cases passed across two files.
- `npm run build`: passed, TypeScript check followed by Vite 8.3.0 build.
- Locked tooling: TypeScript 6.0.3, Vite 8.3.0 and Vitest 5.0.2. Local checks used Node.js 22.14.0; README setup specifies Node 22.x at least 22.12, compatible with the locked tooling.
- No workflow files exist; GitHub Actions runs API again returned total_count: 0. CI is planned, not passing/verified.
- No Playwright dependency, configuration or tests exist. Browser smoke evidence remains the owner's earlier manual report; no new browser test was performed.
- Hosting/live URL and the full publication content/history review remain pending. npm ci was not run and no dependencies were installed during this task.

### TypeScript strict verification

Ran `npx --no-install tsc --showConfig` using the installed compiler. The command is equivalent to the requested `npx tsc --showConfig` while preventing dependency installation. Output resolves the project files and compiler options but does not explicitly include strict or its subordinate flags.

To establish effective behavior rather than infer it from absent entries, read the installed TypeScript 6.0.3 compiler and parsed the same tsconfig via its API. Its getStrictOptionValue returns the compiler default when no flag is supplied; in this compiler, strict defaults to enabled unless explicitly false.

The API confirmed all of these effective options as true: noImplicitAny, noImplicitThis, strictNullChecks, strictFunctionTypes, strictBindCallApply, strictPropertyInitialization, strictBuiltinIteratorReturn, useUnknownInCatchVariables and alwaysStrict. Config parsing reported zero errors. The actual TypeScript/Vite build also passed.

This corrects the prior documentation audit's claim that strict checking was off. That claim relied on the lack of an explicit entry and was not a valid defaults check. Application code, tests and configuration were left unchanged.

### README preparation

Created README.md in English for QA Engineer / QA Automation Engineer recruitment. It introduces the working demo and technical skills, provides local setup/test/build commands, maps business rules to risks and linked Vitest evidence, describes the stored-time defect, architecture, limitations, roadmap and actual AI contribution.

Implemented behavior is separated from planned CI, hosting, Playwright and QA Release Check. The README's dated local verification refers to application commit 87f9c3b; it does not claim a CI pass, automated UI tests, coverage percentage or a live deployment. Owner-reported manual checks link to section 9.

### Publication preparation — 2026-10-14

Decision: use free GitHub Pages for the public repository. The first release is limited to public GitHub, a professional README/risk map, verified basic CI and a working static demo. Playwright and QA Release Check follow publication. The application schedule was clarified later on the same day, as recorded below.

Prepared locally:
- `.github/workflows/ci-pages.yml`: Node.js 22, `npm ci` -> `npm run test:run` -> `npm run build`, on main pushes, pull requests and manual runs. Actions are pinned to full commit SHAs from the official Vite Pages example.
- A separate deployment job depends on successful verification and accepts only main pushes/manual main runs. Only that job receives `pages: write` and `id-token: write`; PRs cannot upload a Pages artifact or deploy. No `pull_request_target` trigger is used.
- `vite.config.ts`: base `/slotledger-qa-demo/`. Vite rewrites the existing favicon reference correctly; no index.html, application logic, test or UI change was needed.
- README: first-person manual-check narrative, a commit-pinned link to the existing malformed-time storage regression, and accurate preparation status. The owner's Development approach section is unchanged; the risk table, architecture, defect example and limitations are retained.

Actual local verification (Node.js 22.14.0):
- `npm run test:run`: **93/93 passed across two files**.
- `npm run build`: **passed**, TypeScript then Vite 8.3.0.
- Inspected `dist/index.html`: JS, CSS and favicon all start with `/slotledger-qa-demo/`; every referenced file exists in dist. This is build-output verification, not a browser or deployed smoke test.
- npm ci was not run locally and no dependencies were installed. Clean installation will be verified by the first actual CI run. No CI run, public deployment or new browser-flow result is claimed.

Publication content/history review:
- Before the email rewrite, local HEAD and cached origin/main matched the TASK 006 commit (now `87f9c3b61415e93961309b558079d764e2319941` on local main); this checkout is not shallow. Reviewed tracked/current file scope, all historical filenames and commit subjects across 22 commits reachable from local refs, and scanned all 91 reachable blobs for private keys, common provider tokens, credential assignments/URLs, local personal paths and email addresses. No matches in blob contents were found.
- Historical extra assets are Vite starter files; the removed hero PNG was also visually inspected. No accidentally committed environment files, credential files, personal documents, node_modules or build outputs were found in the reviewed paths.
- Secret-pattern checks also covered commit messages and all 21 current tracked/proposed files, with no matches. Final diff checks confirmed no changes to application code, tests, package files, index.html or tsconfig; the Development approach paragraph matches the owner's original text exactly.
- At review time, commit author/committer metadata contained one private email address. The owner subsequently declined its public exposure and authorized the local rewrite described below. The address is intentionally not copied into this log.
- This is a bounded local review, not a guarantee that no secret exists. Remote-only refs, unreachable Git objects, GitHub settings and external attachments were not audited; remote refs were not refreshed during this preparation.

Publication deliverables — current status:
1. Completed: approved migration and publication of the independent slotledger-qa-demo; original archive remains private. Anonymous requests cannot retrieve any of the 22 original commits in the new repository.
2. Completed: Pages uses GitHub Actions, with the github-pages environment restricted to the main branch.
3. Completed: workflow 38573433621 verified npm ci, tests, build and deployment. Further approved main pushes automatically repeat the workflow. Do not merge the previous history back into main.
4. Completed: actual live URL, assets and create -> display -> refresh -> persists verified by Codex in isolated Chrome.
5. Remaining synchronization: owner commits/pushes current README, AGENTS, log and screenshot; verify the resulting workflow. Live Demo link and real CI evidence are prepared locally. No extra feature or test scope blocks this step.

References used for configuration: [Vite GitHub Pages guide](https://vite.dev/guide/static-deploy.html#github-pages), [GitHub Pages availability](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

Repository visibility changes and website deployment follow the owner's authorization/Git workflow. Package.json `private: true` prevents accidental npm package publication; it does not set GitHub visibility.

No new dependency, extra UI feature, general migration layer, coverage target or speculative date rule is required for this milestone. Optional refactors must not delay publication or job applications.

### Commit-email privacy — 2026-10-14

The owner declined public exposure of the private email in existing commits. They reported enabling GitHub email privacy and set the repository-local email to `334506433+MattZurr@users.noreply.github.com`; Codex verified that local setting. The owner explicitly authorized rewriting local history. A verified Git bundle and copies of all five modified/untracked files were stored outside the repository before the operation.

Completed locally:
- Created an isolated bare copy from the backup bundle. Replaced author/committer email headers in all 22 commits and remapped parent IDs, without installing tools or changing file trees.
- Before updating main, verified every rewritten commit against its original: exact file tree, commit message, author/committer names and dates, and mapped parent sequence. Signed commits would have stopped the procedure; none were present.
- Updated local main to `87f9c3b61415e93961309b558079d764e2319941` only after verification. All 22 reachable commits use the noreply email. Original working files and Git status were preserved byte for byte during the operation.
- Updated current README, AGENTS and log references to the equivalent new commit IDs. Historical document contents inside old commits were preserved, including their original textual commit references. The README regression-test link now targets the rewritten commit and will become available on GitHub after the remote update.

No new TASK 005F commit, push, visibility change or deployment was performed. Cached origin/main and the private remote still contain the previous history; local backups/reflogs also retain it for recovery. This operation does not claim deletion of old objects from GitHub. Check remote refs and any remaining access to original commits before making the repository public. Tests/build were not repeated because application/configuration content was unchanged from the successful local checks above.

### First remote verification — 2026-10-14

The owner created commit `5fec675ae4a97273d92dc6f95128ac4b353e1534` (ci: prepare GitHub Pages deployment and portfolio documentation), covering the five planned files, and pushed main using explicit force-with-lease. Codex confirmed local HEAD, origin/main and GitHub main at that commit. Working tree was clean at verification start. GitHub API confirms private visibility.

Actual [workflow run 38560762472](https://github.com/MattZurr/slotledger-qa-demo-private-archive/actions/runs/38560762472), triggered by push in the original repository (now the private archive):
- [Test and build job](https://github.com/MattZurr/slotledger-qa-demo-private-archive/actions/runs/38560762472/job/115840950164): **success** on Ubuntu 24.04, Node.js 22.23.3/npm 10.9.9. Logs confirm npm ci, 93/93 Vitest tests (58 validation/creation, 35 storage), TypeScript/Vite build, and successful upload of the Pages artifact.
- [Deploy to GitHub Pages job](https://github.com/MattZurr/slotledger-qa-demo-private-archive/actions/runs/38560762472/job/115841052651): **failure** at Configure Pages. The API returned Not Found and requested enabling Pages/configuring GitHub Actions as the source. Deploy was skipped; no public deployment or live URL is verified.
- Overall workflow conclusion is **failure**, despite successful test/build verification. Do not add a badge implying a green whole workflow. The PR trigger is configured but no actual PR run has been verified.

**Publication blocker identified at this review — email privacy:** authenticated GitHub API still retrieved the original TASK 006 commit by its pre-rewrite SHA and returned the private email in metadata. This was not evidence of anonymous access while the repository was private, but proved the old object remained retrievable. A force push alone did not establish safe public exposure. GitHub documents that old commits may remain accessible through cached SHA views and that cleanup can require Support; Support acceptance is not guaranteed ([GitHub guidance](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)). The subsequent approved migration below resolves this finding for the new publication repository, without claiming deletion from the private archive.

Publication alternatives presented at this review (the owner subsequently selected the first):
- Keep the current repository private under an archive name and create a new independent repository (not a fork) under slotledger-qa-demo. Push only rewritten main, preserving its 23-commit history. Verify original SHAs are unavailable in the new repository before public release. This is the recommended bounded path; no rename, repository creation or visibility change has been performed.
- Keep this repository private while asking GitHub Support whether it can purge original commit objects/cached views; verify the result before publication. No support message was sent.

**Valuable after publication — build-tooling maintenance:** CI npm ci reported one high-severity advisory. A read-only local npm audit --json confirmed source-map-js 1.2.1, a transitive dev dependency via PostCSS/Vite, affected by [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q); patched version is 1.2.2. The advisory concerns denial of service while processing malicious indexed source maps. Scope assessment: the demo publishes static dist assets and has no user source-map upload/processing flow; no concrete exploit of the hosted booking flow is established. This finding did not cause the CI/deployment failure. A targeted patch update is useful maintenance, subject to owner approval; no npm audit fix, package change or dependency installation was performed. Reassess before adding any untrusted source-map processing.

The documentation update from this review distinguished successful CI test/build from failed deployment and unresolved privacy. It remained local at the time of the subsequent migration; no further local tests/build were repeated because only documentation changed.

### Independent publication repository — 2026-10-14

The owner explicitly approved preserving the original repository as a private archive and creating a new independent slotledger-qa-demo with the rewritten history. Public visibility and public deployment were reserved for a separate approval.

Completed by Codex:
- Verified the expected remote repository ID, private visibility, main at 5fec675, availability of the archive name, 23 local main commits and noreply author/committer metadata. Created and verified another bundle backup before remote changes.
- Renamed the original repository (ID 1390725006) to `MattZurr/slotledger-qa-demo-private-archive`, preserving private visibility.
- Created `MattZurr/slotledger-qa-demo` as an empty independent private repository, not a fork (new ID 1418948555).
- Verified the new repository identity and empty refs before pushing only refs/heads/main, with automatic tag following disabled. All 23 corrected commits are preserved; local main and origin/main remain at 5fec675. Local uncommitted documentation changes were preserved. No new commit or dependency installation was performed.
- Checked all 22 original commit SHAs through the new repository's authenticated API: each returned commit-not-found (HTTP 422, No commit found for SHA), with zero originals retrievable. Both repositories remain private. This establishes unavailability in the new repository at verification time; it does not claim removal from backups, the private archive or GitHub storage. Anonymous checks follow publication approval.
- Existing GitHub connector access does not include the new private repository yet. Verification and migration used the existing Git credential manager credential in memory; no credential value was printed or written to project files. No plugin or dependency was installed.

Actual [new-repository workflow run 38569514723](https://github.com/MattZurr/slotledger-qa-demo/actions/runs/38569514723), commit 5fec675:
- [Test and build](https://github.com/MattZurr/slotledger-qa-demo/actions/runs/38569514723/job/115870780271): **success**. Logs confirm Node.js 22.23.3, npm ci, two passing test files/93 passing tests, build and artifact upload.
- [Deploy to GitHub Pages](https://github.com/MattZurr/slotledger-qa-demo/actions/runs/38569514723/job/115870952908): Configure Pages **failed** with Not Found; Deploy **skipped**. Overall run conclusion remains failure. Pages is not enabled, and no successful deployment or live smoke check is claimed.
- The same high-severity build-tooling advisory remains reported; no dependency change was made.

At this point, the current README CI link was updated to the new repository run and original CI evidence links were preserved under the private archive name. Documentation changes remained local. Public visibility and deployment still awaited separate approval, which the owner subsequently provided as recorded below.

### Public repository and GitHub Pages — 2026-10-14

The owner explicitly approved making only the new slotledger-qa-demo public, enabling GitHub Pages and running the public deployment. Codex completed the approved settings changes and dispatched the existing workflow on main. No new application commit or dependency installation was performed.

Actual publication configuration and privacy evidence:
- Public repository: https://github.com/MattZurr/slotledger-qa-demo (ID 1418948555), main at `5fec675ae4a97273d92dc6f95128ac4b353e1534`.
- Authenticated API confirms the original archive (ID 1390725006) remains private. Anonymous API requests cannot access the archive.
- Anonymous API requests retrieved the public repository and all 23 main commits; every author/committer email uses the approved GitHub noreply address. All 22 original SHAs returned commit-not-found in the new public repository. This does not claim deletion from the private archive or local backups.
- Pages build_type is workflow (GitHub Actions). The github-pages environment uses custom deployment branch policies allowing the main branch only; no tag pattern is allowed.

Actual successful [workflow run 38573433621](https://github.com/MattZurr/slotledger-qa-demo/actions/runs/38573433621), workflow_dispatch on main at 5fec675:
- [Test and build](https://github.com/MattZurr/slotledger-qa-demo/actions/runs/38573433621/job/115884280664): **success**. Logs confirm Node.js 22.23.3, npm ci, two passing files/93 tests, TypeScript/Vite build and Pages artifact upload.
- [Deploy to GitHub Pages](https://github.com/MattZurr/slotledger-qa-demo/actions/runs/38573433621/job/115884407031): **success**, including Configure Pages and Deploy. Overall workflow conclusion: **success**.
- Verified live URL: https://mattzurr.github.io/slotledger-qa-demo/ . This is the actual configured/deployed URL, not an inferred placeholder.
- The previously recorded high-severity source-map-js build-tooling advisory remains; no dependency change was authorized or made. It did not block tests/build/deployment.

Deployed-browser smoke evidence:
- Codex used installed Chrome 155.0.8059.40 headless, viewport 1280 x 900, an isolated temporary profile, and Chrome DevTools Protocol. No Playwright or other package was installed or added to the project.
- Live index and its referenced JS, CSS and favicon all returned HTTP 200 with the /slotledger-qa-demo/ base.
- In initially empty browser-local storage: Room A, 2026-10-19, 09:00-10:00 -> native form submission -> success message and one matching card -> page reload -> the same card restored, with the exact same serialized localStorage value and hidden empty state. Passed on 2026-10-14 at 13:42:40 UTC (15:42:40 Warsaw).
- The successful scenario recorded zero JavaScript exceptions, failed browser requests or HTTP error responses. Screenshot after reload was visually inspected and copied to docs/screenshots/slotledger-demo.png.
- The first temporary verification attempt read the page before reload finished because of a stale load event in the CDP script. Corrected the helper's event handling and reran successfully. No application defect or source change was involved.
- This is one deployed-browser smoke scenario, not a maintained Playwright/E2E suite, cross-browser evidence or a new check of storage-error, keyboard or narrow-layout flows. Earlier owner-reported local manual checks remain separate evidence.

Current README includes the real Live Demo URL, successful CI/deployment run, screenshot and bounded browser evidence. Development approach, risk table, architecture and defect example are retained. These documentation/asset updates are local for the owner's final commit/push; then verify that commit's workflow and close TASK 005F. Recruitment remains scheduled for 2026-10-19/20; no further feature work is required to share the verified public repository/demo.

### Recruitment schedule clarification — 2026-10-14

The owner plans to start actively sending CVs and LinkedIn applications on Monday 2026-10-19 or Tuesday 2026-10-20. Until Monday, the priority is focused development of SlotLedger: complete TASK 005F/publication first, then advance TASK 007 and, if time permits, TASK 008. Completion of the full roadmap is not a prerequisite for beginning applications. This supersedes earlier wording implying that applications are already being sent. Commit, push, dependency installation and publication approval requirements remain unchanged.

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
