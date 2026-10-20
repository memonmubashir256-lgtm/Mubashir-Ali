import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      brand: 'VYRO',
      mode: 'production-ready',
      timestamp: new Date().toISOString(),
    });
  });

  // Age verification simulation API
  app.post('/api/verify-age', (req: Request, res: Response) => {
    const { birthYear, country } = req.body;
    const currentYear = new Date().getFullYear();
    const age = currentYear - parseInt(birthYear, 10);
    const minAge = country === 'UK' || country === 'EU' ? 18 : 21;

    if (age >= minAge) {
      res.json({
        success: true,
        isAgeVerified: true,
        age,
        minAge,
        auditToken: `ID_VERIFIED_${Date.now()}`,
      });
    } else {
      res.status(403).json({
        success: false,
        error: `Customer must be at least ${minAge} years old.`,
      });
    }
  });

  // Mount Vite middleware for dev or serve dist in production
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[VYRO] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[VYRO] Server error:', err);
});
