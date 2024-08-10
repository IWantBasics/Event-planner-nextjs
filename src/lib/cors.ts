import Cors from 'cors';
import type { NextApiRequest, NextApiResponse } from 'next';

// Initialize the CORS middleware
const cors = Cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    origin: [
      'https://event-planner-nextjs-xi.vercel.app',
      'https://event-planner-nextjs-git-main-iwantbasics-projects.vercel.app',
      'https://event-planner-nextjs-d1souicsb-iwantbasics-projects.vercel.app'
    ], // List all domains here
  });
// Define the type for the middleware function
type MiddlewareFunction = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: (result?: any) => void
) => void;

// Helper function to run middleware
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: MiddlewareFunction
): Promise<void> {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export { cors, runMiddleware };
