# AGENTS.md

This guide is for autonomous coding agents operating in this repository.
Follow these rules before making code changes.

## Project Overview

- Stack: Next.js App Router + TypeScript + Convex + Playwright.
- Package manager/runtime: Bun.
- Lint/format: Biome (with auto-fix in lint script).
- Type checking: `tsc --noEmit` (via lint script).
- Primary source tree: `src/**`, `convex/**`, `tests/**`.
- Reference material exists under `reference/**`; do not treat it as active app code unless explicitly asked.

## Core Commands

### Setup

- `bun install` - install dependencies.

### Development

- `bun dev` - run Next.js dev server + Convex dev in parallel.
- `bun run dev:next` - run only Next.js on port 3000.
- `bun run dev:convex` - run only Convex dev.
- `bun run kill-port` - force-clear port 3000 if needed.

### Build and Production

- `bun run build` - Next.js production build and Convex deploy.
- `bun run build:vercel` - Next.js production build only.
- `bun run start` - serve production build.

### Lint, Format, Types

- `bun run lint` - TypeScript check + Biome check with `--write` (auto-fixes).
- `bun run format` - Biome format with `--write`.

### End-to-End Tests (Playwright)

- `bun run test` - run full Playwright suite in `tests/e2e`.
- `bun run test:ui` - open Playwright interactive UI.
- `bun run test:headed` - run tests in headed mode.
- `bun run test:report` - open the generated Playwright HTML report.

### Single Test Execution (Important)

- Single test file:
  - `npx playwright test tests/e2e/01-authentication.spec.ts`
  - or `bunx playwright test tests/e2e/01-authentication.spec.ts`
- Single test by title:
  - `npx playwright test -g "should ..."`
- Single browser project:
  - `npx playwright test tests/e2e/02-navigation.spec.ts --project=chromium`
- Combine file + project + headed:
  - `npx playwright test tests/e2e/03-ai-demo.spec.ts --project=firefox --headed`

## Repository Conventions

### Formatting and Syntax

- Use spaces for indentation.
- Prefer double quotes in JS/TS.
- Keep imports organized and stable.
- Run `bun run lint` after substantial edits because it applies fixes.

### TypeScript Rules

- TypeScript strict mode is enabled; preserve strict typings.
- Avoid introducing `any` unless truly unavoidable.
- Prefer explicit domain types and narrowing over assertions.
- Use `import type` for type-only imports.
- Path alias `@/*` points to `src/*` (and root fallback); prefer alias imports for app code.

### Naming

- Components: PascalCase (`MainLayout.tsx`).
- Functions/variables: camelCase.
- Route segments/files: kebab-case where applicable in app routes.
- Keep naming aligned with existing neighboring files.

### React / Next.js

- Use function components and existing project patterns.
- Keep hooks at top level; satisfy hook dependency expectations.
- Prefer server/client boundaries already used by the file.
- Follow App Router conventions under `src/app/**`.

### Convex

- Do not edit generated files in `convex/_generated/**`.
- Keep validators and function schemas near Convex queries/mutations/actions.
- Preserve table/index compatibility when editing `convex/schema.ts`.
- Use typed API calls via generated API helpers.

## Error Handling Guidelines

- Never swallow errors silently.
- Use `try/catch` where failure is expected or recoverable.
- Log with actionable context (operation, ids, boundary).
- Return consistent error payloads in API/route handlers.
- In Convex logic, use `ConvexError` for expected/user-facing errors.

## Testing and Validation Expectations

- For small changes: run targeted tests first, then broader checks if needed.
- For UI or route changes: run relevant Playwright spec(s).
- For type-heavy changes: run `bun run lint`.
- If tests are skipped, explicitly state what was not verified.

## Cursor and Agent Rule Files

This repository includes Cursor rule files in `.cursor/rules/`.
Agents should honor them when relevant:

- `ultracite.mdc` - broad coding/lint/type/a11y guidance baseline.
- Persona activation rules:
  - `dev.mdc`
  - `architect.mdc`
  - `analyst.mdc`
  - `pm.mdc`
  - `po.mdc`
  - `sm.mdc`
  - `qa.mdc`
  - `ux-expert.mdc`
  - `bmad-master.mdc`
  - `bmad-orchestrator.mdc`
  - `infra-devops-platform.mdc`

Notes for persona rules:

- They are triggered by explicit `@persona` usage.
- Most persona command systems require `*`-prefixed commands.
- Do not assume persona workflows unless user requests that mode.

## Copilot Instructions

- No repository-level Copilot instructions file was found at `.github/copilot-instructions.md`.

## Practical Agent Workflow

1. Read nearby files and match existing patterns before editing.
2. Make minimal, focused changes.
3. Run targeted validation (`bun run lint` and/or specific Playwright tests).
4. Summarize changed files, validation run, and any remaining risks.

## Safety and Scope

- Do not modify secrets or environment files unless explicitly requested.
- Do not edit generated artifacts (`convex/_generated/**`, build outputs).
- Prefer incremental edits over broad refactors unless asked.
- Treat `reference/**` as archival/reference content by default.
