# Branching, Pull Request, and Tag-based Release Policy

> Status: operational repository policy for the Personal-Website refactor. This file defines intended workflows; it does **not** enable CI or deploy anything. Production releases require a separate, approved deployment workflow.

## Repository and baseline

- Repository: `pebbDev/personal-website`; preserve its full history and the original baseline commit `eefbbb7e7b661cc57947986974575c57495d5781`.
- `main`: production source branch. Do not deploy automatically just because `main` receives a merge; production is promoted from an approved immutable release version.
- `migration/nextjs`: temporary, protected project-integration branch for the full Next.js/React/TypeScript refactor of Website-Clone. All refactor PRs target this branch until cutover.
- `feature/<issue>-<slug>`, `fix/<issue>-<slug>`, `chore/<slug>`: short-lived working branches forked from the relevant integration branch. No direct pushes to protected branches.
- `project/<slug>`: optional **only** for a genuinely independent, parallel workstream requiring isolation and its own preview. Do not create permanent `develop`, `staging`, or `production` branches just to represent environments.

## Branch / PR flow during this refactor

1. Create a short-lived feature/fix branch from `migration/nextjs`.
2. Work within one scoped issue; link PRD, Specs UI, ADR, and tests as applicable.
3. Open a PR targeting `migration/nextjs`. Complete a code review and QA evidence before merge. GitHub enforces PR-only updates; **migration/nextjs** currently has 0 mandatory GitHub approvals, but manual code review and QA evidence remain required. **main** additionally uses Classic Branch Protection mirrored from Happy-Birhday: 1 approval, code-owner review from `@febriyadi` (configured in `.github/CODEOWNERS` on `main`), dismissal of stale approvals, resolved conversations, admin enforcement, no force-push and no deletion. PR authors cannot approve their own changes.
4. Validate build/typecheck/lint/tests and source-to-target visual regressions once CI is available. Do not enable mandatory status checks until their workflows and names have been verified.
5. When the full project is ready, open a reviewed PR from `migration/nextjs` to `main`. The refactor must pass all agreed release, content-rights, responsive, and rollback gates.
6. After cutover, create routine feature/fix branches from `main` and PR directly into `main`; retire `migration/nextjs` only after the project is completed and archived appropriately.

### Safety and rights requirements

Website-Clone is a source reference with 25 root HTML pages (22 case studies). Rights to third-party name, CV, images, case studies, contacts, logos, fonts, and scripts have not been established. Do not make this content publicly accessible through an unprotected preview or production deployment until ownership or licensing decisions have been recorded. The missing Lenis vendor script is a known source anomaly; never silently add an unlicensed substitute. A preview URL with no authentication is not a private environment.

## Release flow: build once, promote the same artifact

**A branch is a code integration line, not an environment. A tag identifies a release candidate or final release.**

- Production deployments must be triggered by an approved release process for an immutable version `vMAJOR.MINOR.PATCH`, not by automatic pushes to `main`.
- A release candidate is `vMAJOR.MINOR.PATCH-rc.N`. Staging validates that precise commit and built artifact. After final approval, the stable tag `vMAJOR.MINOR.PATCH` must refer to the **same commit SHA** as the approved candidate. Never move an existing tag.
- GitHub tag ruleset protects `refs/tags/v*` from updates and deletion; it intentionally permits creation of new tags.
- GitHub Actions deployment workflow (to be implemented later) must verify the candidate SHA, select the expected environment, ensure required checks/QA and recorded human release approval, and deploy the exact same artifact digest to production without rebuilding with different source. Configure GitHub Environments with a production approval gate if the account supports it.
- Ensure candidate commit is reachable from `main` before issuing a stable production tag. Prefer creating release-candidate tags **after** the reviewed merge into `main` but **before** production promotion, so the same SHA is deployed to both staging and production.
- Hotfixes branch from `main`, use expedited tests and review, then receive their own patch version and tag.
- Never merge a shared `staging` branch wholesale into `main` when it contains unrelated, unapproved features. Choose independently reviewed PRs or a dedicated project integration branch. For features merged but not ready to expose, use explicitly designed feature flags.
- If concurrent work requires isolated testing, use separately secured per-PR or per-project preview environments. Tags do not themselves provide environment isolation.

**Example (illustrative; do not run until CI and deploy providers exist):**

```text
feature/WEB-123-capsule-navigation ──PR──> migration/nextjs
feature/WEB-124-case-studies      ──PR──> migration/nextjs
migration/nextjs ──release cutover PR──> main (commit ABC123)
main@ABC123 ──tag v1.0.0-rc.1──> authenticated staging
same main@ABC123 ──tag v1.0.0──> production, only after approval
```

The candidate and stable tags point to the same SHA; artifacts must be verified by digest. Version numbers and ticket IDs above are examples only.

## Active GitHub safeguards (configured 2026-11-11)

| Target | Ruleset ID | Enforced GitHub rules |
| --- | --- | --- |
| `main` | `27006731` + Classic Branch Protection | PR required; **1 approval + code-owner review (`@febriyadi`)**, dismiss stale reviews, resolve conversations, enforce admins, block force-push and deletion. The existing ruleset also remains active. |
| `migration/nextjs` | `27006735` | PR required, block non-fast-forward updates, block deletion; resolve PR threads; required approvals = 0 |
| tags `v*` | `27006749` | Block updates and deletion; new tag creation allowed |

Verified against Happy-Birhday's Classic Branch Protection on 2026-11-11: the `main` review settings match the reference. `main` has `.github/CODEOWNERS` (`* @febriyadi`) added via PR #2. The comparison reference uses Classic Branch Protection rather than repository rulesets; Personal-Website retains its existing rulesets as additional safeguards. No required status checks are configured yet because the destination has no CI workflows. Do not merge a PR to `main` without an eligible **separate** review account.

## Minimum PR acceptance evidence

- Linked issue, clear scope, and testable acceptance criteria.
- Type of change and target source routes.
- Run lint, typecheck, build, relevant tests, and preview screenshot comparison **once available**; missing checks must be declared, not marked passing.
- Review safety: no force-push to protected refs, no secrets/unauthorized personal data or assets.
- Independent QA / reviewer comments and design deviations where required.
- No public deployment before rights authorization and human release GO.

## Deferred decisions

- Hosting and deployment provider, domains, staging/private preview access policy and budget.
- GitHub Actions jobs and required status check names.
- GitHub Environments / deployment approval settings.
- Feature-flag provider or local implementation.
- Next.js/Node/runtime versions, QA screenshot thresholds, and multi-agent permissions.

Source reading: [GitHub repository rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets), [GitHub Actions environments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments).
