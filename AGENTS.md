# AGENTS.md — AEOFixer

Standard agent instructions for Codex and other OpenAI-compatible coding agents.

---

## Setup

```bash
# Install all dependencies (run from repo root)
npm install
cd client && npm install && cd ..

# Configure environment
cp .env.example .env
# Edit .env: set DATABASE_URL (local postgres), OPENAI_API_KEY (for manual runs)

# Run database migrations
npm run db:migrate

# Verify setup
npm run typecheck
npm test
```

Expected: `npm test` should pass all unit and integration tests (e2e may require a running dev server).

---

## Code Style

### TypeScript (applies to both `src/` and `client/src/`)

- TypeScript strict mode — no `any`, no non-null assertions (`!`) without a comment explaining why
- ESM throughout (`"type": "module"` in package.json)
- Named exports preferred over default exports (exception: React page components)
- Interface over type alias for object shapes; type alias for unions and primitives
- `async/await` — never raw `.then()/.catch()` chains in new code
- Error handling: wrap all `async` service calls in try/catch; throw typed errors (`AppError`)
- No `console.log` in production code — use the `pino` logger (`import { logger } from '@/utils/logger'`)

### React (client/)

- Functional components only — no class components
- Props interfaces named `<ComponentName>Props`
- Custom hooks named `use<Thing>` in `client/src/hooks/`
- No business logic in components — it belongs in hooks or `lib/api.ts`
- Tailwind CSS for styling — no inline styles, no CSS modules unless absolutely necessary
- `useCallback` / `useMemo` only when profiling shows a problem (don't premature-optimize)

### API (src/)

- Route handlers in `src/api/` must be thin: validate input → call service → return response
- Services in `src/services/` must be pure or easily mockable (inject dependencies)
- All route handler errors must flow through the Express error middleware
- Use Zod for request validation (define schemas in `src/api/schemas/`)

---

## Testing

### Mandatory Workflow

1. **Write the failing test first** (red). Commit it with `test: <signal-name> fails (red)`
2. **Implement** until tests pass (green). Commit with `feat: implement <signal-name>`
3. **Run the full suite** before pushing: `npm test`

### Commands

```bash
npm test              # all tests
npm run test:unit     # Vitest unit + integration only
npm run test:e2e      # Playwright e2e only (requires dev server)
npm run test:watch    # watch mode during development
npm run test:coverage # coverage report
```

### Rules

- **Never call real external APIs in tests** — mock `openai`, mock `axios`/`fetch` for crawling
- Every new `src/services/signals/` file needs a matching test in `tests/unit/signals/`
- Use HTML fixture files in `tests/fixtures/` for deterministic parsing tests
- Test file naming: `<module-name>.test.ts` co-located or under `tests/`
- Minimum coverage targets: statements 80%, branches 75% (enforced in CI)

---

## Pull Request Instructions

Every PR must include:

1. **Evidence** — one of: test output, screenshot, curl response, or recorded terminal session
2. **Linked task** — reference the TODO.md item being completed
3. **Test status** — confirm `npm test` passes locally before opening PR
4. **Description written by you** — do not submit AI-generated PR descriptions unreviewed; read and edit them

### PR Title Format

```
<type>(<scope>): <short description>

Types: feat | fix | test | refactor | docs | chore | ci
Examples:
  feat(scorer): add speakable-schema signal
  fix(crawler): handle 5xx redirects gracefully
  test(suggestions): mock OpenAI for unit tests
```

### What Reviewers Check

- [ ] Tests written before implementation (check commit order)
- [ ] No real API calls in tests
- [ ] No `any` types introduced
- [ ] DB schema changes have migrations generated
- [ ] `CLAUDE.md` updated if a new gotcha was discovered
