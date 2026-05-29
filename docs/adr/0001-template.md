# ADR 0001: [Title]

**Date:** YYYY-MM-DD  
**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-XXXX  
**Deciders:** joshiujjwal

---

## Context

What is the issue we are facing? What forces are at play (technical, product, team)?

## Decision

What is the change we are making?

## Rationale

Why this option over alternatives? Include the options considered:

| Option | Pros | Cons |
|--------|------|------|
| Option A (chosen) | … | … |
| Option B | … | … |

## Consequences

What becomes easier? What becomes harder? What technical debt are we accepting?

---

# ADR 0002: Cheerio vs Puppeteer for HTML Crawling (v1)

**Date:** 2025  
**Status:** Accepted  
**Deciders:** joshiujjwal

## Context

AEOFixer needs to fetch and parse web pages. Some pages require JavaScript execution to render their content. Puppeteer (headless Chrome) can handle JS-rendered pages; Cheerio parses static HTML only.

## Decision

Use **Cheerio only** for v1. No headless browser.

## Rationale

| Option | Pros | Cons |
|--------|------|------|
| Cheerio (chosen) | Lightweight, fast, easy to test, no browser binary | Can't handle JS-rendered pages |
| Puppeteer | Handles SPAs, JS rendering | Heavy (~300MB), slow, complex, harder to host |

For v1, the majority of high-value target pages (blog posts, docs, landing pages) are server-rendered or static. JS rendering is a Phase 2+ concern.

## Consequences

- Crawler is fast and cheap to run
- Pages built entirely with client-side rendering will score poorly (expected, and noted in UI)
- Parking lot item: add optional Puppeteer fallback for JS-heavy pages

---

# ADR 0003: Drizzle ORM over Prisma

**Date:** 2025  
**Status:** Accepted  
**Deciders:** joshiujjwal

## Context

Need an ORM for PostgreSQL in a TypeScript ESM project.

## Decision

Use **Drizzle ORM**.

## Rationale

| Option | Pros | Cons |
|--------|------|------|
| Drizzle (chosen) | Lightweight, SQL-like API, excellent TypeScript inference, ESM-native, Drizzle Studio | Smaller ecosystem, migrations less mature |
| Prisma | Large ecosystem, excellent DX, good docs | Heavy binary, Prisma Client generation step, ESM support historically problematic |

## Consequences

- Schema is TypeScript-first in `src/db/schema.ts`
- Run `npm run db:generate` after schema changes
- Drizzle Studio available via `npm run db:studio`
