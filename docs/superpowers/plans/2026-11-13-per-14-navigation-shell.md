# PER-14 navigation shell implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans, test-driven-development and verification-before-completion.

**Goal:** Source-faithful capsule nav, CSS foundation and text-only route placeholders.
**Architecture:** one client nav island, semantic tokens + dedicated component CSS, typed [slug] route registry.
**Tech Stack:** Next 16, React 19, TS, Tailwind 3, lucide-react, Node test runner.
**Spec:** docs/superpowers/specs/2026-11-13-per-14-design.md

## Global Constraints

Do not copy source image icons/identity; light-first theme no toggle; preserve exact .html URLs and source breakpoint at 900px; protect main checkout and rights.

## Review Focus

/index.html alias, invalid 404, active nav state, mobile safe-area and scroll state, reduced motion and keyboard access.

### Task 1: Typed routes

- [ ] Write failing tests for all 25 routes / unknown / alias. Run red.
- [ ] Implement src/lib/routing/routes.ts and App Router pages. Run green.

### Task 2: Navigation fidelity

- [ ] Write failing contract check for nav source labels, icon imports and breakpoint. Run red.
- [ ] Implement shared nav and CSS, preserve scroll/active/focus states. Run green.

### Task 3: Theme and integration

- [ ] Set source-derived tokens, font stacks and layout.
- [ ] Install Lucide, run lint/typecheck/build/HTTP/browser evidence; review diffs.
- [ ] No push/merge/deploy without human approval.
