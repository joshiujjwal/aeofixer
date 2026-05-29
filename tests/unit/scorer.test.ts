// AeoScorer unit tests — write these BEFORE implementing AeoScorer
// Each test documents the expected behaviour for one signal

import { describe, it, expect } from 'vitest';

// import { AeoScorer } from '@/services/scorer.js';
// import { readFileSync } from 'fs';
// import { resolve } from 'path';

// Helper: load an HTML fixture
// const fixture = (name: string) =>
//   readFileSync(resolve(__dirname, '../fixtures', name), 'utf-8');

describe('AeoScorer', () => {
  describe('faq_schema signal', () => {
    it('scores 100 when valid FAQPage JSON-LD is present', () => {
      // const html = fixture('faq-schema-valid.html');
      // const report = AeoScorer.score(html);
      // const signal = report.signals.find(s => s.key === 'faq_schema');
      // expect(signal?.score).toBe(100);
      // expect(signal?.passed).toBe(true);
      expect(true).toBe(true); // RED: remove this when implementing
    });

    it('scores 0 when no JSON-LD is present', () => {
      expect(true).toBe(true); // RED: remove this when implementing
    });

    it('scores 0 when JSON-LD is present but @type is not FAQPage', () => {
      expect(true).toBe(true); // RED: remove this when implementing
    });
  });

  describe('answer_first_structure signal', () => {
    it('scores 100 when first paragraph is ≤40 words', () => {
      expect(true).toBe(true); // RED
    });

    it('scores 0 when first paragraph exceeds 40 words', () => {
      expect(true).toBe(true); // RED
    });
  });

  describe('image_alt_coverage signal', () => {
    it('scores 100 when all images have non-empty alt text', () => {
      expect(true).toBe(true); // RED
    });

    it('scores proportionally when some images lack alt text', () => {
      expect(true).toBe(true); // RED
    });

    it('scores 100 (N/A) when page has no images', () => {
      expect(true).toBe(true); // RED
    });
  });

  describe('heading_hierarchy signal', () => {
    it('scores 100 for correct H1→H2→H3 structure', () => {
      expect(true).toBe(true); // RED
    });

    it('scores 0 when H1 is missing', () => {
      expect(true).toBe(true); // RED
    });

    it('scores 0 when heading levels are skipped (H1→H3)', () => {
      expect(true).toBe(true); // RED
    });

    it('scores 0 when multiple H1s exist', () => {
      expect(true).toBe(true); // RED
    });
  });

  describe('meta_conciseness signal', () => {
    it('scores 100 when title ≤60 chars and description ≤155 chars', () => {
      expect(true).toBe(true); // RED
    });

    it('scores 50 when title is too long but description is fine', () => {
      expect(true).toBe(true); // RED
    });
  });

  describe('overall score', () => {
    it('computes weighted average of all signals', () => {
      expect(true).toBe(true); // RED
    });
  });
});
