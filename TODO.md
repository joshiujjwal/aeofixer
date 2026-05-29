# AEOFixer — Task Breakdown

## How to Use This File

Work one task at a time. For each task:
1. **Write failing tests first** (red phase) — no implementation yet
2. **Implement until tests pass** (green phase)
3. **Review the diff manually** — read every line you're committing
4. **Commit with a descriptive message** referencing the task
5. **Update CLAUDE.md or AGENTS.md** if you discovered something new (compound learning loop)
6. **Gate the next phase** — do not start Phase N+1 until Phase N tests are all green and reviewed

---

## Phase 0: Foundation ⬜

> Goal: working repo, CI green, first smoke test passing

- [ ] Init `package.json` at root (api) — Node 20, TypeScript 5, ESM
- [ ] Init `client/package.json` — Vite + React 18 + TypeScript
- [ ] Configure `tsconfig.json` (strict mode, path aliases `@/`)
- [ ] Set up ESLint + Prettier (shared config across api + client)
- [ ] Set up Vitest for unit/integration tests
- [ ] Set up Playwright for e2e tests
- [ ] Add `npm run dev` (concurrently: api on :3001, client on :5173)
- [ ] Add `npm test` (Vitest + Playwright)
- [ ] Write first smoke test: `GET /health` returns `{ status: "ok" }`
- [ ] Create `.env.example` with all required keys documented
- [ ] Set up Drizzle ORM + PostgreSQL connection
- [ ] GitHub Actions CI: install → lint → test on push/PR
- [ ] Review all AI config files (CLAUDE.md, AGENTS.md, copilot-instructions.md)

**Evidence gate:** CI green on `main`, health endpoint smoke test passing in logs ✅

---

## Phase 1: Core AEO Scoring Engine ⬜

> Goal: given a URL, return a structured AEO score with signal breakdown

- [ ] Write unit tests for `AeoScorer` service (all signals, edge cases)
- [ ] Define AEO signal rubric (see `docs/spec.md` §3) as TypeScript constants
- [ ] Implement `CrawlerService.fetch(url)` — fetch HTML with Cheerio
- [ ] Implement `AeoScorer.score(html)` — returns `AeoReport` type
  - [ ] Signal: FAQ / Q&A schema present (`application/ld+json`)
  - [ ] Signal: `HowTo` or `Article` schema present
  - [ ] Signal: Answer-first paragraph structure (≤40 words, answers implied question)
  - [ ] Signal: Image alt text coverage (% of images with descriptive alt)
  - [ ] Signal: Heading hierarchy (`h1` → `h2` → `h3`, no skips)
  - [ ] Signal: `<title>` and `<meta description>` conciseness (≤60 / ≤155 chars)
  - [ ] Signal: Internal links with descriptive anchor text
  - [ ] Signal: Speakable schema (`speakable` property in JSON-LD)
- [ ] Persist `AeoReport` to PostgreSQL (`audits` table)
- [ ] `POST /api/audits` — accepts `{ url }`, returns `AeoReport`
- [ ] Integration tests for `POST /api/audits` with mock HTML fixtures
- [ ] Manual test: run against a real URL, save response as fixture

**Evidence gate:** All unit + integration tests passing, sample audit output in `tests/fixtures/` ✅

---

## Phase 2: GPT-4o Suggestion Engine ⬜

> Goal: GPT-4o turns audit signals into specific, actionable content rewrites

- [ ] Write unit tests for `SuggestionService` with mocked OpenAI responses
- [ ] Design prompt templates in `src/services/prompts/` (versioned, testable)
  - [ ] Prompt: JSON-LD schema generator (FAQ, HowTo, Article, Speakable)
  - [ ] Prompt: Alt text rewriter for images with `src` + surrounding context
  - [ ] Prompt: Answer-first paragraph rewriter
  - [ ] Prompt: Meta description optimizer for AI snippet extraction
- [ ] Implement `SuggestionService.suggest(report)` — calls GPT-4o, returns `Suggestion[]`
- [ ] Implement rate limiting + retry logic for OpenAI API calls
- [ ] Persist suggestions to PostgreSQL (`suggestions` table)
- [ ] `GET /api/audits/:id/suggestions` — returns suggestions for an audit
- [ ] Integration tests with stubbed OpenAI responses (no real API calls in CI)
- [ ] Manual test: verify generated JSON-LD is valid (use `schema.org` validator)

**Evidence gate:** All tests passing, sample suggestion JSON in `tests/fixtures/suggestions/` ✅

---

## Phase 3: React Dashboard ⬜

> Goal: usable UI for submitting URLs and reading audit results

- [ ] Write component tests with Vitest + React Testing Library
- [ ] `AuditForm` — URL input, submit button, loading state
- [ ] `ScoreGauge` — circular progress, 0–100, colour-coded (red/amber/green)
- [ ] `SignalBreakdown` — table of each AEO signal with score + status icon
- [ ] `SuggestionCard` — displays one suggestion with copy-to-clipboard for JSON-LD
- [ ] `AuditHistoryTable` — list of past audits for a domain, sortable by score/date
- [ ] Dashboard page wiring: `AuditForm` → polling `GET /api/audits/:id` → results
- [ ] History page: `GET /api/audits?domain=` → `AuditHistoryTable`
- [ ] API client in `client/src/lib/api.ts` (typed fetch wrappers, error handling)
- [ ] Responsive layout (works on 375px mobile + 1280px desktop)
- [ ] Playwright e2e: submit URL → see score rendered

**Evidence gate:** e2e test passing, screenshots of score + suggestion UI in PR ✅

---

## Phase 4: Auth + Multi-Tenant ⬜

> Goal: users have private audit history, API keys are protected

- [ ] Choose auth provider (Clerk recommended — see ADR)
- [ ] Add auth middleware to all `/api/*` routes
- [ ] Associate audits with `userId` in DB
- [ ] User settings page (API key management, notification preferences)
- [ ] Rate limiting per user (10 audits/day on free tier)
- [ ] Integration tests for authenticated + unauthenticated requests

**Evidence gate:** Auth flow e2e test passing, unauthenticated 401 tests passing ✅

---

## Phase 5: Polish & Harden ⬜

> Goal: production-ready, observable, documented

- [ ] Add OpenTelemetry tracing (Jaeger or Honeycomb)
- [ ] Structured JSON logging (Pino)
- [ ] `GET /api/audits/:id/diff` — compare two audits for same URL (score delta)
- [ ] Batch audit mode: `POST /api/audits/batch` accepts sitemap URL
- [ ] Export audit report as PDF
- [ ] Lighthouse-style shareable report URL (`/report/:auditId`)
- [ ] README badges: CI status, test coverage
- [ ] Security audit: OWASP Top 10 checklist

**Evidence gate:** Load test results attached to PR, zero high-severity findings in security scan ✅

---

## Phase 6: Ship ⬜

- [ ] Choose deployment target (Railway preferred for PostgreSQL bundled)
- [ ] Dockerfile for api + client
- [ ] `docker-compose.yml` for local dev with PostgreSQL
- [ ] Environment variables documented in `.env.example`
- [ ] Deploy to staging, smoke test all endpoints
- [ ] Deploy to production
- [ ] Add uptime monitoring (Better Uptime or UptimeRobot)
- [ ] Announce 🎉

**Evidence gate:** Production URL responding, uptime monitor green ✅

---

## Parking Lot 🅿️

*Ideas to revisit later — not blocking any phase*

- Browser extension: right-click → AEOFixer audit (Chrome + Firefox)
- CLI tool: `npx aeofixer https://example.com` for CI integration
- Competitor comparison: audit your URL vs competitor URLs side-by-side
- AI-powered "what would Perplexity cite?" simulation
- Webhook: auto-audit on new deployments (GitHub Actions integration)
- WordPress plugin

---

## Lessons Learned 📝

*Update this as you build — this is the compound loop*

| Date | Lesson |
|------|--------|
| —    | (add findings here as you discover them) |
