# PER-11 — GitHub Actions CI Foundation (Design)

> **Status:** Owner-directed execution, 2026-11-12. Owner requested implementation on existing `chore/PER-10-nextjs-foundation` branch. The owner did not separately review this written spec; record this as a task-scoped exception to the usual sequential document approval gate.
> **Source authority:** [PER-11](https://linear.app/bobona/issue/PER-11/set-up-github-actions-lint-typecheck-build-and-required-checks), `AGENTS.md` Section 4/6, `docs/BRANCHING-AND-RELEASE.md`.

## Purpose
Introduce a minimal, non-deploying, read-only GitHub Actions CI gate for Next.js/React/TypeScript PRs. Prove it locally first; activate required status checks only after observing a successful real PR run.

## Decisions
- Trigger: `pull_request` to both `migration/nextjs` and `main`, no paths filter (required checks must not be skipped by docs-only PRs). No `pull_request_target` or deploy trigger.
- One job `quality`, with explicit stable display name `quality` and workflow name `CI`. Do **not** assume GitHub's displayed check name until a real PR run.
- Ubuntu GitHub-hosted runner, Node.js 24 matching the protected Vercel foundation project; pnpm version from `packageManager: pnpm@12.15.0`; frozen lockfile, lifecycle scripts disabled.
- Commands: `pnpm install --frozen-lockfile --ignore-scripts`, `pnpm run lint`, `pnpm exec next typegen` before `pnpm run typecheck`, `pnpm run build`.
- Minimum `GITHUB_TOKEN` permissions `contents: read`; no cloud credentials/secrets, artifact upload, Vercel Git integration, public preview, production deploy, or GitHub environments.
- Use official action major versions documented as current on 2026-11-12: `actions/checkout@v7`, `pnpm/action-setup@v6`, `actions/setup-node@v7`; pin exact pnpm via project metadata and Node 24. Cache pnpm store using lockfile; do not cache `node_modules` or Next.js artifacts.
- Keep scope CI foundation; component/E2E/visual tests become separate jobs only when PER-20 test infrastructure exists and is verified.

## Validation and handoff
- Confirm workflow YAML parses and includes intended trigger/job/commands/security limits.
- Execute equivalent local install, lint, typegen, typecheck and build with evidence.
- Do not mark CI active or required checks configured until a non-protected branch is pushed, a PR targeting `migration/nextjs` is opened, and a real workflow run succeeds. Check name must be taken from observed GitHub run, not this document.
- Preserve all existing local changes and Git history, especially Preview 0 files; no production or deployment change. Independent review and owner release rights gates remain applicable.
