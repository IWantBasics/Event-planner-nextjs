import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  origin: 'https://event-planner-nextjs-xi.vercel.app', // Allow your Vercel domain
});

type MiddlewareFunction = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: (result: any) => void
) => void;

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

// Add axios interceptor
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const fetchUpcomingEvents = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get('/api/events/upcoming', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    throw error;
  }
};

export { cors, runMiddleware };
