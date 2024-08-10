// lib/auth.ts
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: any;
}

export const authenticateJWT = (req: AuthenticatedRequest, res: NextApiResponse, next: () => void) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    jwt.verify(token, process.env.POSTGRES_JWT_SECRET as string, (err, user) => {
      if (err) {
        res.status(403).json({ message: 'Forbidden' });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
