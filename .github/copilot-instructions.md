# GitHub Copilot Instructions — AEOFixer

## Project Context

AEOFixer is a TypeScript + React + Node.js + PostgreSQL web app that analyzes web pages for Answer Engine Optimization (AEO) signals and uses GPT-4o to generate actionable improvement suggestions. The goal is to help content rank better in AI-powered search engines (Perplexity, ChatGPT Browse, Google SGE).

**Stack:** TypeScript 5 (strict) · React 18 · Vite · Express · Drizzle ORM · PostgreSQL · OpenAI GPT-4o · Vitest · Playwright · Tailwind CSS

---

## Coding Conventions

### TypeScript
- Always use **strict TypeScript** — no `any`, no `@ts-ignore`
- Prefer `interface` for object shapes, `type` for unions
- Use path alias `@/` (maps to `src/` in api, `client/src/` in frontend)
- All async functions must have explicit return types
- Use `AppError` (custom class) for all thrown errors — never throw plain strings

### React
- Functional components only, no class components
- Props must have a named interface: `interface ScoreGaugeProps { ... }`
- No business logic in JSX — extract to hooks (`use<Name>`) in `hooks/`
- All API calls go through `client/src/lib/api.ts` typed wrappers
- Tailwind classes for all styling; no inline styles

### Backend
- Express routes = thin layer: validate with Zod → call service → respond
- Services in `src/services/` must be side-effect-free and mockable
- Logger: `pino` (`import { logger } from '@/utils/logger'`) — no `console.log`
- DB queries: Drizzle ORM only — no raw SQL in route handlers

---

## Testing Conventions

- **Write tests first, always** — Copilot should help write the failing test before the implementation
- Test files: `tests/unit/<module>.test.ts` or co-located `<module>.test.ts`
- Use `vi.mock()` to mock OpenAI and external HTTP — never real API calls in tests
- Use HTML fixtures in `tests/fixtures/` for crawler/scorer tests
- When asked to implement a feature, suggest writing the Vitest test first

---

## AEO Domain Knowledge

When working on AEO signals, understand these:
- **FAQ Schema** — `application/ld+json` with `@type: "FAQPage"` boosts AI citation chances
- **Answer-first structure** — the first paragraph should directly answer the page's main question in ≤40 words
- **Speakable** — `speakable` in JSON-LD marks content suitable for voice/AI reading
- **HowTo schema** — step-by-step content should use `HowTo` JSON-LD
- Signal weights are defined in `src/services/scorer.ts` — don't change without updating `docs/spec.md`

---

## Boundaries

- **Do not** refactor code outside the scope of the current task unless explicitly asked
- **Do not** remove existing tests, even if they seem redundant
- **Do not** add new npm dependencies without noting it in the PR description
- **Do not** call `process.exit()` in library code
- **Do not** hardcode any API keys, URLs, or secrets — always use environment variables
- **Do not** change the Drizzle schema without generating a migration (`npm run db:generate`)
- **Always** update `CLAUDE.md` Lessons Learned if you discover a non-obvious gotcha
