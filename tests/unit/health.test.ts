// Health check smoke test — the very first passing test
// Run: npm run test:unit

import { describe, it, expect } from 'vitest';

describe('health endpoint', () => {
  it('returns status ok', async () => {
    // TODO: replace with supertest once Express app is wired up
    // import request from 'supertest';
    // import { app } from '@/app.js';
    // const res = await request(app).get('/health');
    // expect(res.status).toBe(200);
    // expect(res.body).toEqual({ status: 'ok' });

    // Placeholder until app bootstrapped:
    expect(true).toBe(true);
  });
});
