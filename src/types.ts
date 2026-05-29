// Core TypeScript types for AEOFixer
// These mirror the data model defined in docs/spec.md §4

export type SignalKey =
  | 'faq_schema'
  | 'article_schema'
  | 'speakable_schema'
  | 'answer_first_structure'
  | 'image_alt_coverage'
  | 'heading_hierarchy'
  | 'meta_conciseness'
  | 'internal_link_quality';

export interface AeoSignal {
  key: SignalKey;
  score: number;          // 0–100
  weight: number;         // 0–1, sum of all weights = 1
  passed: boolean;
  details: string;
  rawValue?: unknown;
}

export interface AeoReport {
  id: string;
  url: string;
  userId: string;
  createdAt: Date;
  overallScore: number;
  signals: AeoSignal[];
  status: 'pending' | 'complete' | 'failed';
  errorMessage?: string;
}

export type SuggestionType =
  | 'json-ld'
  | 'content-rewrite'
  | 'alt-text'
  | 'meta'
  | 'heading';

export interface Suggestion {
  id: string;
  auditId: string;
  signalKey: SignalKey;
  type: SuggestionType;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  beforeContent?: string;
  afterContent: string;
  status: 'pending' | 'applied' | 'dismissed';
}

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}
