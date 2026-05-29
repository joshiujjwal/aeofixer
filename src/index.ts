// Entry point — wires up Express app and starts the server
// TODO: implement after Phase 0 setup

import express from 'express';
import cors from 'cors';
import { logger } from './utils/logger.js';

export const app = express();

app.use(cors({ origin: process.env['CORS_ORIGIN'] ?? 'http://localhost:5173' }));
app.use(express.json());

// Health check — the first endpoint to implement
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// TODO: mount API routes
// app.use('/api/audits', auditRouter);
// app.use('/api/suggestions', suggestionRouter);

// TODO: global error middleware

const PORT = Number(process.env['PORT'] ?? 3001);

if (process.env['NODE_ENV'] !== 'test') {
  app.listen(PORT, () => {
    logger.info({ port: PORT }, 'AEOFixer API started');
  });
}
