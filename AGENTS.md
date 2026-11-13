# Personal-Website — Agent Operating Contract

> Status: Draft. Sections 1–4 and 6 documented; Sections 7–8 drafted for owner review; Section 5 pending.
> Scope: Repository guidance, not a replacement for the active Notion product decisions or Linear issues.

## 1. Mission & Project Identity

### Primary Mission
Recreate the observed Website-Clone experience in the existing `pebbDev/personal-website` repository through a full refactor to Next.js, React, and TypeScript. This is a fidelity-first website-cloning and engineering-practice project, not a free redesign.

### North Star
**Preserve the Experience. Modernize the Architecture.**

### Reference & Scope
- Use the local `Website-Clone` project and its verified source evidence as the visual, content-structure, and interaction reference—not the historical frontend in this repository.
- Cover all **25 root HTML pages**: homepage (`index.html`), Meet Me (`meet-me.html`), My Lab (`work.html`), and **22 distinct case studies**.
- Preserve observed layout, typography, media composition, content hierarchy, responsiveness, interactions, motion, and required `.html`/hash URL behavior.
- Modernize implementation structure without erasing page-specific differences; architecture conventions must not override observed source styling or behavior.

### Learning & Review Context
- The primary deliverable is a faithful, maintainable website clone.
- The owner uses **human review** of implementation quality, fidelity, and agent workflow to learn how effectively the model and coding agents work.
- Do **not** create a formal agent-scoring system, evaluation dashboard, or benchmark framework without a separate requirement.
- Follow the project's strict spec/plan approval workflow before code-changing work; its detailed protocol will be defined in a later section.

### Non-Goals
- No speculative redesign, feature expansion, CMS, backend, or other infrastructure without requirements and approval.
- No presentation of another person's identity, CV, contact information, or portfolio work as the owner's own.
- No claim that a successful build or completed foundation proves 25-route coverage, visual parity, or release readiness.

### Rights & Distribution Boundary
Website-Clone includes third-party identity and creative assets whose reuse rights are not verified. Private technical study does not authorize redistribution. Do not publish or expose uncleared content through this public GitHub repository, public deployments, or unsecured previews. Any public release requires explicit rights clearance and human authorization.

## 2. Context Sources & Authority

- **Owner:** Final authority for project scope, decisions, and spec/plan approvals.
- **Notion:** [Project Hub](https://app.notion.com/p/4131629627ab80839692c40e8b8a0fce) — PRD, UI Specs, ADR, and recorded decisions.
- **Linear:** [Project](https://linear.app/bobona/project/personal-website-nextjs-full-refactor-46ada2c93068) — issue scope, acceptance criteria, priorities, and dependencies.
- **Superpowers docs:** `docs/superpowers/<issue-id>-<slug>/specs/` and `plans/` — task-specific design specs and implementation plans.
- **Website-Clone:** `D:\Portofolio Design\Website-Clone` — read-only reference for observed design, content structure, and interactions.
- **Repository:** [pebbDev/personal-website](https://github.com/pebbDev/personal-website) — implemented code, configuration, and technical evidence.

### Context Rules
- Read only task-relevant sources; verify version, approval status, and actual implementation.
- Respect domain-specific authority: proposals are not approvals; code state is not a product decision.
- When material sources conflict or required evidence is inaccessible, continue read-only analysis but **do not implement the affected scope** until the owner resolves it.

## 3. Repository & Documentation Structure

### Architecture
Follow a feature-based Next.js App Router structure:
- `src/app/` — thin route entries, layouts, and global styles.
- `src/features/<feature>/` — page/feature composition (`home`, `meet-me`, `work`, `case-study`).
- `src/features/<feature>/components/` — feature-specific components grouped by section.
- `src/components/common/` — shared application components (e.g., navigation, footer).
- `src/components/ui/` — reusable UI primitives.
- `src/constants/` — navigation and typed static content data.
- `src/types/` — shared TypeScript contracts.
- `src/lib/` — shared utilities.
- `public/assets/` — authorized static assets only.

### Code Organization Rules
- Keep route files thin; delegate page composition to feature modules.
- Separate structured content from rendering; use shared components only for genuinely shared behavior.
- Preserve each case study's unique composition, source styling, and interactions.
- Use Client Components only where interactive behavior requires them.
- Follow the existing naming and import conventions; do not introduce unrelated redesigns or dependencies.
- Confirm exact `.html` routing and content modeling in an approved task-specific plan, not by assumption.

### Superpowers Documentation
- Store task-specific specs in `docs/superpowers/<issue-id>-<slug>/specs/`.
- Store task-specific plans in `docs/superpowers/<issue-id>-<slug>/plans/`.
- Use dated filenames, reference the Linear issue, and retain approved versions.
- Do not duplicate PRDs, ADRs, or issue requirements in these files.

## 4. Strict Plan-First AI-Native SDLC

Follow **Plan → Design → Build → Test → Deploy → Maintain**. Superpowers is the sole workflow orchestrator; specialist tools support it without introducing competing plans or approval gates.

### Workflow & Approvals
1. **Plan:** Inspect relevant Notion/Linear decisions, source fidelity evidence, and actual code. Confirm scope, constraints, acceptance criteria, and rights.
2. **Design:** Use Superpowers brainstorming; write a task-specific design spec in the Section 3 location. Obtain **explicit owner approval**.
3. **Build plan:** Use Superpowers writing-plans; specify exact files, interfaces, risks, incremental tasks, tests, and rollback. Obtain **separate explicit owner approval** before code-changing work.
4. **Build:** Execute only the approved plan with Superpowers (TDD/red-green-refactor, small increments, and systematic debugging).
5. **Test:** Run and record static checks, relevant unit/component, browser E2E, responsive, accessibility, and screenshot-diff tests. Compare observed behavior to Website-Clone; require human fidelity review.
6. **Deploy:** Review diff, test evidence, and approvals before PR/merge; follow protected-branch and release rules. Never publish uncleared third-party content or create unsecured previews.
7. **Maintain:** Track regressions, dependency/security updates, and technical debt in Linear; apply the same spec/plan/test/review workflow to changes.

### Tools & Responsibilities
- **Superpowers:** brainstorming, specs/plans, TDD, execution, debugging, code review, verification, branch handoff.
- **Context7 CLI:** consult current, version-specific library documentation when API behavior or configuration matters.
- **Vitest + React Testing Library:** planned unit/component test stack; **Playwright Test:** planned reproducible browser E2E and visual regression stack.
- **WebCodex:** authorized local execution and exploratory browser QA; browser automation alone does not replace versioned tests.
- **GitHub Actions + Rulesets:** PER-11 workflow merged to `migration/nextjs` via PR #5 (2026-11-12); the hosted `quality` job passed on the PR head. Required-check enforcement and a negative PR-gating test remain **Pending**. **Vercel:** only the sanitized, access-protected Preview 0 is authorized for QA; Git-connected deployments and public release are not approved.
- **Linear + Dependabot:** maintain issue/defect traceability and review dependency updates when configured.

### Non-Negotiable Gates
- No implementation without approved spec **and** approved plan; re-approve material scope or design deviations.
- Stop affected implementation on unresolved authority conflicts; read-only investigation may continue.
- Never invent, skip, weaken, or claim unrun tests; mark unavailable checks **Pending/Blocked**.
- A green build is not QA pass; QA pass is not visual parity; review approval is not release authorization.
- Record evidence and intentional deviations; owner retains final acceptance and release authority.

## 6. Git, Release & Safety Governance

> **Operating contract:** Git branches coordinate integration; tags identify release versions; environments are separately secured deployment targets. CI success is not release authorization. Reverify GitHub rules and recorded evidence before merge or release.

### Branches & Pull Request Flow
- Preserve the complete history of `pebbDev/personal-website` and rollback baseline `eefbbb7e7b661cc57947986974575c57495d5781`.
- `main` is the production **source** branch, not an automatic production-deployment trigger. `migration/nextjs` is the temporary protected integration branch for the 25-page refactor; all refactor PRs target it until an approved cutover.
- Work in short-lived `feature/<issue>-<slug>`, `fix/<issue>-<slug>`, or `chore/<slug>` branches from the relevant base. Reserve `project/<slug>` for an independently isolated workstream. Do not create permanent `develop`, `staging`, or `production` branches to represent environments.
- Never push directly to protected refs, force-push them, delete them, or bypass rules. Each PR must link its Linear issue and applicable approved PRD/UI Specs/ADR, name affected routes and behavior, and explain design deviations.
- Human review and QA evidence are required before merging any refactor PR, even where GitHub mandates zero approvals. Do not merge a PR while required evidence or unresolved review threads remain.
- For full cutover, open a reviewed `migration/nextjs` → `main` PR only after rights, fidelity, responsive, CI, QA, reviewer, owner-GO, and rollback gates pass. Subsequently PR routine changes into `main`; retire the migration branch only after archival and approval.

### Rulesets & Review Safeguards
- **Current rulesets, checked 2026-11-12:** `main` ruleset `27006731` and `migration/nextjs` ruleset `27006735` both enforce PR updates, non-fast-forward/force-push and deletion blocks, and resolved review threads. `migration/nextjs` requires **0 GitHub-enforced approvals**; separate human review remains mandatory.
- **Main Classic Branch Protection snapshot (recorded 2026-11-11):** at least **1 eligible independent approval**, code-owner review via `.github/CODEOWNERS` (`* @febriyadi`, introduced on `main` by PR #2), dismiss stale reviews, resolve threads, and enforce protections for admins. Authors cannot approve their own PRs; secure a different eligible reviewer. The Classic configuration was previously compared with the Happy-Birhday reference. **Live Classic settings were not reverified on 2026-11-12 (API 403); check them before merge.**
- **Tags:** ruleset `27006749` protects `refs/tags/v*` against update and deletion while allowing creation of new version tags. Never rewrite existing protected release tags.
- Do not alter any protection or invent a required check name. Verify actual GitHub-hosted workflow/check names and passing results from a real PR before configuring required status checks or claiming branch gating Verified.

### CI, PR Evidence & Review Gates
- **GitHub Actions CI** lives in `.github/workflows/ci.yml` (PER-11; merged PR #5, 2026-11-12). Its display name is **Git, Release & Safety Governance** and stable job/check identity is `quality`; GitHub-hosted run #2 on the PR head passed. Required-check enforcement is still **Pending**. The workflow runs PR quality checks, **not** Vercel deployments, release promotion, or rights approval.
- PR quality baseline: frozen pnpm-lockfile install, ESLint, Next.js route type generation, TypeScript, production build; add relevant component/E2E, responsive, accessibility and source-versus-target screenshot testing when installed and approved. An absent or queued job is **Pending**, not passing.
- PR acceptance record: linked issue and testable acceptance criteria; type of change, source/target routes, exact commands and results; QA screenshots/visual review when available; independent reviewer findings; intentional deviations; content-rights/security check; rollback evidence and human sign-off. Explicitly mark unavailable checks **Pending/Blocked**.
- Apply least-privilege CI permissions; do not allow CI or branch merge to publish uncleared media, credentials, personal data or unsecured previews. A PR merge is not a production release.

### Immutable Releases, Environments & Rollback
- Production releases require a **separately approved process**; a push/merge to `main` must never deploy to production automatically.
- Use immutable candidate tags `vMAJOR.MINOR.PATCH-rc.N` and stable tags `vMAJOR.MINOR.PATCH`. A candidate and its promoted stable version must reference the **same approved commit SHA**, reachable from `main`. Prefer creating the candidate after the reviewed cutover/merge to `main` and before promotion.
- Validate the candidate SHA in **authenticated staging**, record required checks, fidelity and rights decisions, human release GO, and artifact digest. Build **once**, then promote the **identical built artifact** to production; never rebuild from a different source or silently change dependencies during promotion.
- The future deploy workflow must verify approved SHA/tag, environment, artifact digest, required checks, QA/rights evidence and human release approval. Use GitHub Environments production approvers if supported and approved. **Deployment automation remains Pending** until implemented and tested.
- For hotfixes, branch from `main`, apply focused review/tests, and issue a new immutable patch tag. Keep rollback to a previously approved artifact/SHA executable and evidenced; never move tags to simulate rollback.
- Do not merge unrelated shared-staging work into `main`. Use approved isolated PRs, secured per-PR/per-project previews, or explicitly designed feature flags for work not ready to expose. A Git tag does not isolate an environment.
- Example sequence (illustrative, not an execution instruction): `feature/* → PR migration/nextjs → reviewed cutover PR main@SHA → v1.0.0-rc.1 authenticated staging → v1.0.0 same SHA/artifact production after GO`.

### Content Rights, Preview & Safety
- Rights to Website-Clone names, contact data, CV, photos, logos, case studies, fonts and scripts are **not assumed**. Private study is not a publication license. Do not commit, redistribute, or deploy unauthorized content to a public repository, production, or an unauthenticated preview.
- An unauthenticated preview URL is public exposure. Any QA preview using allowed content must be access-protected and its protection verified before upload; protect generated paths as well as UI links. The missing Lenis vendor script is a known anomaly—do not silently substitute unlicensed code.
- The sanitized Vercel foundation preview uses **Vercel Authentication (All Deployments)** as a **limited QA exception**, not rights clearance, Git-connected auto-deployment authorization or production release GO. Review actual team/project settings at every deployment.

### Pending Decisions & Source References
- Pending until separately accepted and verified: public hosting/domain policy, deployment provider and budget, preview authentication, GitHub check enforcement, GitHub Environments/approvers, feature-flag design, Node/Next version policy, QA screenshot thresholds, multi-agent permissions, rollback automation and complete rights ledger.
- Track implementation and evidence in Notion/Linear/GitHub; do not treat these policy statements as evidence that CI/CD, required checks, release tags, or deployment protection were executed.
- GitHub documentation: [repository rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets) and [deployment environments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments).

## 7. Verification, Evidence & Definition of Done

> **Rule:** No completion or quality claim without fresh, relevant evidence from the exact code/configuration and environment being evaluated. Use Superpowers `verification-before-completion` as the primary verification gate; `requesting-code-review` and `finishing-a-development-branch` support independent review and integration handoff. These skills do not replace owner approval or the Git/release gates in Sections 4 and 6.

### Verification Before Claims
- **Identify → Run → Read → Verify → Report:** name the acceptance criterion and proving command/test; execute it on the current intended tree/commit; inspect complete output, exit code, and failures; compare expected versus observed results; only then record **Verified**. A previous green run, code diff, agent assertion, or successful build alone is insufficient.
- Match evidence to each claim: lint requires clean lint output; type safety requires a typecheck; build requires a successful build; regression fix requires reproduction and relevant regression test; visual parity requires measured source-versus-target comparison and human review.
- Re-run affected checks after material edits or environment changes. Review actual Git diff and final file inventory when another agent executes work; do not treat an agent's completion message as proof.
- Use a **proportional verification matrix**: static checks for code/config changes; targeted unit/component tests for logic; browser E2E for routes and interactions; responsive, accessibility, reduced-motion and screenshot-diff checks for affected UI. Expand scope when dependencies or cross-page regressions warrant it. An unconfigured tool or unrun test remains **Pending**, never silently passing.

### Evidence & Traceability
- For each task/PR, link the Linear issue and approved spec/plan; record the tested commit SHA or exact local snapshot, commands and versions, environment, timestamps, exit codes, test counts, and URLs/CI run IDs where applicable. Attach minimal, reproducible logs, browser screenshots/diffs and reviewer findings for relevant changes.
- Maintain a requirements-to-evidence map: **criterion → test or observation → result → evidence reference → reviewer/owner decision**. Record uncovered routes, failed tests, known limitations, intentional deviations and follow-up issues explicitly.
- Evidence must be inspectable and attributable to the tested version. Keep secrets, authentication cookies, sensitive third-party media and unauthorized personal data out of logs, attachments, public CI artifacts and PRs. Store durable product decisions in Notion, work status in Linear, and code/CI/PR proof in GitHub, linking rather than duplicating.

### Definition of Done (Scope-Specific)
- **Task DoD:** approved task acceptance criteria have been checked against actual behavior; relevant tests pass on the reviewed change; findings and intentional deviations are resolved or explicitly approved; evidence and status are recorded. `Implemented` is not automatically `Verified` or `Done`.
- **PR DoD:** constituent tasks meet Task DoD; the actual GitHub-hosted CI checks for the PR head/merge context pass; independent code review, necessary route/visual QA, rights/safety checks, and unresolved-thread handling satisfy Section 6. A Draft PR, mergeability indicator or green local build is not independent approval.
- **Release DoD:** PR DoD plus approved release criteria, rights/identity clearance, protected staging validation, same-SHA/same-artifact provenance, rollback evidence, and explicit human release **GO**. For the full-refactor cutover, verify all **25 source routes** (including 22 unique case studies), relevant media, exact URL/`.html` and hash behavior, interactions, responsive breakpoints, motion/reduced-motion and visual fidelity against Website-Clone with human review. A merged PR is not a release.
- Apply the level appropriate to the task: minor non-UI work does not automatically require the full 25-page visual matrix, but it must not be used to waive any agreed cross-cutting or release gate.

### Results, Blockers & Handoff
- Use explicit states: **Proposed** (suggested), **Accepted** (owner-approved), **Implemented** (changed), **Verified** (evidence-backed), **Pending** (not yet checked), **Blocked** (cannot proceed), and **Superseded** (replaced). State exactly what was checked, what failed or was skipped, and what remains unknown.
- On test failure, missing evidence, unresolved security/rights issue or unapproved deviation, **stop the affected gate**; capture the failure and corrective issue, fix and re-run the relevant checks. Do not weaken tests or fabricate a pass. Exceptions require explicit owner approval and must not waive public-release rights or safety boundaries.
- Before PR merge or branch handoff, use Superpowers `requesting-code-review` and `finishing-a-development-branch` where applicable; preserve uncommitted work, present actual verified state and remaining gates, and leave merge/release decisions to the owner.

## 8. Agent Behavior & Operational Boundaries

> **Purpose:** Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed. **Tradeoff:** These guidelines bias toward caution over speed; for trivial tasks, use judgment. They complement—not replace—Sections 1–4, 6–7, approved specs/plans, rights boundaries, and human review.

### Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State assumptions explicitly. If uncertain, ask before changing the affected scope.
- If multiple interpretations exist, present them—don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something material is unclear, stop the affected implementation. Name what's confusing and ask; read-only investigation may continue under Section 2.

### Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios. Do not confuse *impossible* with an unverified failure mode or a required safety boundary.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: **"Would a senior engineer say this is overcomplicated?"** If yes, simplify.

### Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it—don't delete it.

When your changes create orphans:
- Remove imports, variables, or functions that **your changes** made unused.
- Don't remove pre-existing dead code unless asked.

**The test:** Every changed line should trace directly to the user's request and the approved plan.

### Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass."
- "Fix the bug" → "Write a test that reproduces it, then make it pass."
- "Refactor X" → "Ensure tests pass before and after."

For multi-step tasks, state a brief plan and match each step to evidence:

```text
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification. Use Section 7 to classify the result as **Verified**, **Pending**, or **Blocked**; never treat an unrun check as success.

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
