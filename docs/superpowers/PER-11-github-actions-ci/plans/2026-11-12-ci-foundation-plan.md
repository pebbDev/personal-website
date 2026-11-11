# PER-11 — GitHub Actions CI Foundation (Implementation Plan)

> **Status:** Owner-directed execution 2026-11-12; task-scope instruction authorizes work on the existing branch, **not** permission to bypass tested merge gates or publish uncleared assets. Separate review of these written documents was not collected.
> **Spec:** `docs/superpowers/PER-11-github-actions-ci/specs/2026-11-12-ci-foundation-design.md`
> **Issue:** [PER-11](https://linear.app/bobona/issue/PER-11/set-up-github-actions-lint-typecheck-build-and-required-checks)

## Task 1 — Establish baseline
- [x] Inspect existing branch/status, package scripts, pnpm lockfile, repository policy, issue acceptance, current GitHub Actions directory.
- [x] Preserve untracked `docs/superpowers/PER-21-protected-preview`, `scripts/preview0`, `AGENTS.md`, `.claude` and all application source/legacy assets.
- [x] Select PR-only CI and a single `quality` job to avoid premature required-check name drift.

## Task 2 — Workflow implementation
- [ ] Create `.github/workflows/ci.yml`; `on: pull_request` scoped to `migration/nextjs`, `main`, with no path filters.
- [ ] Set `permissions: contents: read`; Node 24, `pnpm/action-setup@v6`, `setup-node@v7`, pnpm store cache and explicit frozen install, ESLint, `next typegen`, typecheck, Next build.
- [ ] Exclude deployment, production, artifact uploads, secrets, and optional test suites not yet installed.

## Task 3 — Local testing and review
- [ ] Confirm YAML parses and structural checks: event/branches/job/permissions/action versions/commands, absence of deploy/secrets.
- [ ] Run equivalent frozen install and repo lint/typegen/typecheck/build commands, log any failing gate accurately.
- [ ] Independently review workflow diff and repo status for unintended changes.

## Task 4 — Remote activation (separate release/PR authority)
- [ ] Commit/push the reviewed workflow only when authorized under repository safeguards, then open a PR into `migration/nextjs`.
- [ ] Verify **actual** GitHub Actions check name and pass on PR, then configure required status check via protected GitHub policy with separate decision. Do not guess names.
- [ ] Test PR gating and record results in PER-11; do not claim Done before remote evidence. No deployment to Vercel.
