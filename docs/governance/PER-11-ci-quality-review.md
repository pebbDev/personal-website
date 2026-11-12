# PER-11 — Independent CI quality-gate review

**Scope:** independent human review of the existing workflow and branch-protection evidence, not a change to application source or delivery approvals.

- Workflow to inspect: [.github/workflows/ci.yml](../../.github/workflows/ci.yml) on migration/nextjs and main.
- GitHub Actions job name: **quality**.
- The workflow triggers on PRs targeting migration/nextjs or main; uses Node.js 24, pnpm frozen lockfile (with --ignore-scripts), ESLint, Next.js type generation, TypeScript check, and Next.js build.
- Workflow permission: contents read. No deployment, secrets, release steps or auto-merge are present in this workflow.
- Branch rules: main Classic Branch Protection and migration/nextjs ruleset both require quality from GitHub Actions (App ID 15368) with strict up-to-date checks.
- Other protected-branch rules must remain intact: independent review requirements on main, PR requirement on migration, no force-push or branch deletion, and no bypass actors for migration ruleset.

## Reproducible test evidence

| Target | Negative (intended failure) | Positive (remediated success) |
| --- | --- | --- |
| main | [PR #8, failing quality](https://github.com/pebbDev/personal-website/actions/runs/43187007764) | [PR #8, passing quality](https://github.com/pebbDev/personal-website/actions/runs/43187760098) |
| migration/nextjs | [PR #9, failing quality](https://github.com/pebbDev/personal-website/actions/runs/43212547054) | [PR #9, passing quality](https://github.com/pebbDev/personal-website/actions/runs/43213341355) |

Both probe PRs were closed **without merge**; temporary lint failures never entered protected branches.

## Human reviewer request

Please review the workflow itself, quality steps, least privilege, trigger coverage, and both branch check requirements against this evidence. Check that the protected workflows do not deploy unlicensed third-party assets. Comment on any missing checks or unsafe assumptions. Record **Approve** or **Request changes** on the review PR for this document after inspection.

**Review acceptance:** a GitHub APPROVED review from an eligible human other than the PR author, with any required changes resolved. An AI/bot comment, test success or document creation alone does not satisfy this criterion.

**Non-goals:** this document does not verify 25 migrated routes, source visual/interaction fidelity, rights clearance, or production deployment. Vercel automatic builds remain held until release gates are met.

**Tracker:** [PER-11](https://linear.app/bobona/issue/PER-11/set-up-github-actions-lint-typecheck-build-and-required-checks).