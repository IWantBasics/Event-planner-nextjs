import Cors from 'cors';
import type { NextApiRequest, NextApiResponse } from 'next';

type MiddlewareFunction = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: (result?: any) => void
) => void;

export const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  origin: (origin, callback) => {
    console.log(`[CORS] Incoming request from origin: ${origin}`);
    const allowedOrigins = [
      'https://event-planner-nextjs-xi.vercel.app',
      'http://localhost:3000',
      'https://event-planner-nextjs-git-main-iwantbasics-projects.vercel.app',
      'https://event-planner-nextjs-d1souicsb-iwantbasics-projects.vercel.app',
      'https://event-planner-nextjs-eyxixm6md-iwantbasics-projects.vercel.app/',
      'https://event-planner-nextjs-git-main-iwantbasics-projects.vercel.app/',
      'https://event-planner-nextjs-97z1bxo6t-iwantbasics-projects.vercel.app',
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      console.log(`[CORS] Origin ${origin} is allowed.`);
      callback(null, true);
    } else {
      console.log(`[CORS] Origin ${origin} is not allowed.`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
});

export function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: MiddlewareFunction
): Promise<void> {
  console.log('[Middleware] Running middleware...');
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        console.error('[Middleware] Middleware error:', result.message);
        return reject(result);
      }
      console.log('[Middleware] Middleware completed successfully.');
      return resolve(result);
    });
  });
}
