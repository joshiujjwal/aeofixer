# AEOFixer

> **Answer Engine Optimization (AEO) tool** — optimizes web content to rank better in AI-powered browsers and search engines (Perplexity, ChatGPT Browse, Bing Copilot, Google SGE, etc.).

![Status](https://img.shields.io/badge/status-🚧%20Early%20Development-orange)
![Stack](https://img.shields.io/badge/stack-TypeScript%20%7C%20React%20%7C%20Node.js%20%7C%20PostgreSQL-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## What It Does

AEOFixer crawls a URL or accepts pasted HTML, then uses GPT-4o to:

- **Audit** pages for AEO signals (structured data, FAQ schemas, concise answer blocks)
- **Score** content on an AEO rubric (0–100) with per-signal breakdowns
- **Suggest** actionable rewrites: alt text, JSON-LD schema markup, heading hierarchy, answer-first paragraphs
- **Generate** drop-in JSON-LD snippets ready to paste into `<head>`
- **Track** score history over time per domain/URL

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18 + TypeScript + Vite        |
| Backend    | Node.js + Express + TypeScript      |
| Database   | PostgreSQL 16 (via Drizzle ORM)     |
| AI         | OpenAI GPT-4o (analysis + rewrites) |
| Auth       | TODO (Clerk or NextAuth)            |
| Deployment | TODO (Railway / Fly.io / Render)    |

---

## Getting Started

```bash
# 1. Clone
git clone https://github.com/joshiujjwal/aeofixer.git
cd aeofixer

# 2. Install all deps
npm install          # root (api)
cd client && npm install && cd ..

# 3. Configure env
cp .env.example .env
# Fill in: DATABASE_URL, OPENAI_API_KEY

# 4. Migrate database
npm run db:migrate

# 5. Start dev servers (runs api + client concurrently)
npm run dev

# 6. Run tests
npm test
```

---

## Project Structure

```
aeofixer/
├── src/
│   ├── api/          # Express route handlers
│   ├── services/     # Business logic (crawler, scorer, gpt-rewriter)
│   ├── db/           # Drizzle schema + migrations
│   └── utils/        # Shared helpers (html-parser, schema-builder)
├── client/
│   └── src/
│       ├── components/  # UI components (ScoreCard, SuggestionList, etc.)
│       ├── hooks/        # Custom React hooks
│       ├── pages/        # Route pages (Dashboard, Audit, History)
│       └── lib/          # API client, types
├── tests/
│   ├── unit/         # Service-level unit tests (Vitest)
│   ├── integration/  # API endpoint tests (Supertest)
│   └── e2e/          # Browser flow tests (Playwright)
├── docs/
│   ├── spec.md       # Feature specification
│   └── adr/          # Architecture Decision Records
├── .github/
│   ├── copilot-instructions.md
│   ├── instructions/
│   └── skills/
├── README.md
├── TODO.md
├── CLAUDE.md
├── AGENTS.md
└── .gitignore
```

---

## Contributing

1. **Always write tests first** — red phase before any implementation
2. **Never submit a PR without evidence** — include test output, screenshots, or curl responses
3. **Small, focused PRs** — one feature or fix per PR
4. **Run the full test suite** before pushing: `npm test`
5. **Update CLAUDE.md / AGENTS.md** if you discover a new convention or gotcha

---

*Built to make web content legible to the AI-first web.*
