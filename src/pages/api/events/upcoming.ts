import { NextApiResponse } from 'next';
import { authenticateJWT, AuthenticatedRequest } from '../../../lib/auth';
import { pool } from '../../../lib/db';

export const authenticateJWT = (req: AuthenticatedRequest, res: NextApiResponse): Promise<void> => {
  return new Promise((resolve, reject) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];

      jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
        if (err) {
          res.status(403).json({ message: 'Invalid token' });
          return reject(err);
        }

        req.user = user;
        resolve();
      });
    } else {
      res.status(401).json({ message: 'No token provided' });
      reject(new Error('No token provided'));
    }
  });
};

