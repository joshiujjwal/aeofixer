// AeoScorer — pure function that scores an HTML document against the AEO rubric
// See docs/spec.md §2.2 for signal definitions and weights
// TODO: implement each signal in src/services/signals/ (one file per signal)

import type { AeoReport, AeoSignal, SignalKey } from '../types.js';

// Signal weights — must sum to 1.0
// Update docs/spec.md §2.2 table when changing these
const SIGNAL_WEIGHTS: Record<SignalKey, number> = {
  faq_schema: 0.20,
  answer_first_structure: 0.20,
  article_schema: 0.10,
  speakable_schema: 0.10,
  image_alt_coverage: 0.10,
  heading_hierarchy: 0.10,
  meta_conciseness: 0.10,
  internal_link_quality: 0.10,
};

export class AeoScorer {
  /**
   * Score an HTML document against the AEO rubric.
   * Pure function — no side effects, no DB calls.
   */
  static score(_html: string): Omit<AeoReport, 'id' | 'url' | 'userId' | 'createdAt'> {
    // TODO: load cheerio, run each signal detector
    const signals: AeoSignal[] = (Object.keys(SIGNAL_WEIGHTS) as SignalKey[]).map((key) => ({
      key,
      score: 0,
      weight: SIGNAL_WEIGHTS[key]!,
      passed: false,
      details: 'Not yet implemented',
    }));

    const overallScore = signals.reduce(
      (acc, s) => acc + s.score * s.weight,
      0,
    );

    return {
      overallScore: Math.round(overallScore),
      signals,
      status: 'complete',
    };
  }
}
