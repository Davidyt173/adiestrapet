import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import healthHandler from './api/health';
import diagnoseHandler from './api/diagnose';

dotenv.config();

// Determine app port:
// In Google AI Studio Build, Nginx listens on 8080 and proxies to port 3000.
// Therefore, the Node/Vite server must ALWAYS listen on port 3000 (never 8080).
function getAppPort(): number {
  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    const parsed = Number(process.argv[portArgIndex + 1]);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  if (process.env.APP_PORT) {
    return Number(process.env.APP_PORT);
  }
  // If PORT is 8080 (Cloud Run / Nginx front-facing port), use 3000 for internal app
  if (process.env.PORT && process.env.PORT !== '8080') {
    return Number(process.env.PORT);
  }
  return 3000;
}

const port = getAppPort();
const app = express();

app.use(express.json({ limit: '30mb' }));

// Full-stack API endpoints
app.get('/api/health', (req: Request, res: Response) => healthHandler(req, res));
app.post('/api/diagnose', (req: Request, res: Response) => diagnoseHandler(req, res));

async function main() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`[AdiestraPet Dev Server] Successfully listening on http://0.0.0.0:${port}`);
  });

  server.on('error', (err: any) => {
    console.error(`[AdiestraPet Dev Server Error]:`, err);
  });
}

main();
