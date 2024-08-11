import Cors from 'cors';
import type { NextApiRequest, NextApiResponse } from 'next';

// Define the type for the middleware function
type MiddlewareFunction = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: (result?: any) => void
) => void;

// Initialize the CORS middleware
const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  origin: [
    'https://event-planner-nextjs-xi.vercel.app',
    'https://event-planner-nextjs-git-main-iwantbasics-projects.vercel.app',
    'https://event-planner-nextjs-d1souicsb-iwantbasics-projects.vercel.app',
    'https://event-planner-nextjs-97z1bxo6t-iwantbasics-projects.vercel.app',
  ],
  credentials: true,
});

// Helper function to run middleware
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: MiddlewareFunction
): Promise<void> {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        console.error(`[ERROR] Middleware error: ${result.message}`);
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export { runMiddleware };
export default cors;
