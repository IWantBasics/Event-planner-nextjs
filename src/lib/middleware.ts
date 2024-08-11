import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  origin: 'https://event-planner-nextjs-xi.vercel.app',
  
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

axios.interceptors.request.use(config => {
  console.log('Axios interceptor: Preparing request');
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Added Authorization header:', config.headers['Authorization']);
    } else {
      console.log('No token found in localStorage');
    }
  }
  return config;
}, error => {
  console.error('Axios interceptor error:', error);
  return Promise.reject(error);
});

export const fetchUpcomingEvents = async () => {
  try {
    const response = await axios.get('/api/events/upcoming');
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    throw error;
  }
};

export { cors, runMiddleware };
