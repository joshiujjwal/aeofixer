# AEOFixer — Feature Specification

**Version:** 0.1  
**Status:** Draft  
**Author:** joshiujjwal  
**Last Updated:** 2025

---

## 1. Overview

### Problem Statement

Traditional SEO focuses on ranking in 10-blue-links search results. AI-powered answer engines (Perplexity, ChatGPT Browse, Bing Copilot, Google SGE) extract and synthesize content differently: they prefer **concise, well-structured, semantically marked-up content** that they can quote as authoritative answers.

Most content creators and webmasters have no tooling to evaluate or improve their AEO (Answer Engine Optimization) posture. AEOFixer fills this gap.

### Solution

A web application that:
1. Accepts a URL (or pasted HTML)
2. Crawls and analyzes the page against an AEO scoring rubric
3. Uses GPT-4o to generate specific, actionable improvement suggestions
4. Tracks score history so users can see improvement over time

---

## 2. Functional Requirements

### 2.1 Audit Engine
- [ ] Accept a valid HTTP/HTTPS URL as input
- [ ] Crawl the URL server-side (bypass CORS, follow redirects, respect robots.txt)
- [ ] Parse HTML with Cheerio to extract structured signals
- [ ] Return a scored `AeoReport` within 30 seconds
- [ ] Handle crawl failures gracefully (timeout, 4xx, 5xx, JS-rendered pages)

### 2.2 AEO Scoring Rubric (v1)

Each signal is scored 0–100. Overall score = weighted average.

| Signal | Weight | Description |
|--------|--------|-------------|
| `faq_schema` | 20% | `FAQPage` JSON-LD present and valid |
| `article_schema` | 10% | `Article` or `NewsArticle` JSON-LD present |
| `speakable_schema` | 10% | `speakable` CSS selectors defined |
| `answer_first_structure` | 20% | First paragraph ≤40 words, directly answers the page's implied question |
| `image_alt_coverage` | 10% | % of `<img>` tags with non-empty, descriptive `alt` attributes |
| `heading_hierarchy` | 10% | No heading level skips; H1 is unique |
| `meta_conciseness` | 10% | `<title>` ≤60 chars, `<meta description>` ≤155 chars |
| `internal_link_quality` | 10% | Anchor text is descriptive (not "click here", "read more") |

### 2.3 GPT-4o Suggestion Engine
- [ ] For each failing signal, generate a specific, copy-paste-ready suggestion
- [ ] JSON-LD suggestions must be syntactically valid and schema.org-conformant
- [ ] Suggestions reference the actual page content (not generic advice)
- [ ] Suggestion confidence level: HIGH / MEDIUM / LOW
- [ ] User can mark suggestions as "applied" or "dismissed"

### 2.4 History & Tracking
- [ ] Store every audit for a given URL
- [ ] Show score delta vs. previous audit for same URL
- [ ] Dashboard shows all audited domains with latest score

### 2.5 User Accounts
- [ ] Sign up / login (email or OAuth)
- [ ] Private audit history per user
- [ ] Free tier: 10 audits/day, 30-day history retention
- [ ] (Future) Pro tier: unlimited audits, PDF export, batch mode

---

## 3. Non-Functional Requirements

- [ ] Audit API response: p95 < 30s (GPT-4o latency dominates)
- [ ] Crawler must not be blocked by basic bot-detection (use rotating user-agents)
- [ ] No raw HTML stored beyond 24 hours (privacy)
- [ ] All user data isolated per `userId` (multi-tenant)
- [ ] API: rate-limited, authenticated
- [ ] WCAG AA compliant UI
- [ ] Zero OpenAI API calls in automated tests (all mocked)

---

## 4. Data Model

```typescript
// Core audit report
interface AeoReport {
  id: string;                      // UUID
  url: string;
  userId: string;
  createdAt: Date;
  overallScore: number;            // 0–100
  signals: AeoSignal[];
  status: 'pending' | 'complete' | 'failed';
  errorMessage?: string;
}

interface AeoSignal {
  key: SignalKey;                  // e.g. 'faq_schema'
  score: number;                   // 0–100
  weight: number;                  // 0–1
  passed: boolean;
  details: string;                 // Human-readable explanation
  rawValue?: unknown;              // Extracted value (e.g. found JSON-LD objects)
}

// GPT-4o suggestion
interface Suggestion {
  id: string;
  auditId: string;
  signalKey: SignalKey;
  type: 'json-ld' | 'content-rewrite' | 'alt-text' | 'meta' | 'heading';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  beforeContent?: string;          // Original content
  afterContent: string;            // Suggested replacement
  status: 'pending' | 'applied' | 'dismissed';
}
```

### PostgreSQL Tables

```sql
-- audits
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  url TEXT NOT NULL,
  overall_score INTEGER,
  signals JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX ON audits (user_id, url, created_at DESC);

-- suggestions
CREATE TABLE suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
  signal_key TEXT NOT NULL,
  type TEXT NOT NULL,
  confidence TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  before_content TEXT,
  after_content TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- users (if not delegating to Clerk)
CREATE TABLE users (
  id TEXT PRIMARY KEY,              -- Clerk user ID
  email TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free',
  daily_audit_count INTEGER DEFAULT 0,
  daily_audit_reset TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 5. API Design

### Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/health` | — | Liveness check |
| `POST` | `/api/audits` | ✅ | Submit URL for audit |
| `GET` | `/api/audits/:id` | ✅ | Get audit result (poll) |
| `GET` | `/api/audits` | ✅ | List audits (filter by `?domain=`) |
| `GET` | `/api/audits/:id/suggestions` | ✅ | Get GPT-4o suggestions |
| `PATCH` | `/api/suggestions/:id` | ✅ | Update suggestion status (applied/dismissed) |
| `GET` | `/api/audits/:id/diff` | ✅ | Score delta vs. previous audit |

### POST /api/audits — Request
```json
{ "url": "https://example.com/blog/post" }
```

### POST /api/audits — Response (202 Accepted)
```json
{
  "id": "uuid",
  "status": "pending",
  "url": "https://example.com/blog/post",
  "pollUrl": "/api/audits/uuid"
}
```

---

## 6. Test Plan

### Unit Tests (Vitest)
- `AeoScorer.score()` with 8 signal fixtures (one per signal, pass + fail each)
- `SchemaExtractor.extract()` with valid/invalid/missing JSON-LD HTML
- `HeadingAnalyzer.analyze()` with good hierarchy, skipped levels, multiple H1s
- `AnswerFirstDetector.detect()` with paragraphs of varying lengths
- `SuggestionService.suggest()` with mocked OpenAI responses
- Rate limiter middleware: allows N, blocks N+1, resets after window

### Integration Tests (Supertest)
- `POST /api/audits` with fixture HTML → correct `overallScore`
- `GET /api/audits/:id` polling behaviour (pending → complete)
- Auth middleware: 401 on missing token, 403 on wrong user
- Error handling: invalid URL, crawl timeout, OpenAI 429

### E2E Tests (Playwright)
- Submit URL → loading state → score displayed
- Click suggestion → see before/after content
- Mark suggestion as "applied" → status updates
- View history page → audits listed in order

### Edge Cases
- Page with no `<head>` element
- Page with 0 images
- Page with valid JSON-LD but wrong `@type`
- URL that returns non-HTML (PDF, image, binary)
- URL behind HTTP auth (should fail gracefully)
- Very long pages (500KB+ HTML)

---

## 7. Open Questions

| # | Question | Owner | Status |
|---|----------|-------|--------|
| 1 | Use Clerk or roll our own auth? Clerk simplest. | joshiujjwal | Open |
| 2 | Puppeteer/Playwright for JS-rendered pages, or Cheerio only for v1? | joshiujjwal | Open — Cheerio for v1 |
| 3 | How should batch mode (sitemap crawl) be rate-limited and queued? | joshiujjwal | Parking lot |
| 4 | Should suggestions be streamed back via SSE? | joshiujjwal | Open |
| 5 | How do we keep the AEO rubric current as AI search evolves? | joshiujjwal | Open — versioned rubrics |
