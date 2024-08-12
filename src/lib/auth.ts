import { NextApiResponse, NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: any;
}

export const authenticateJWT = (req: AuthenticatedRequest, res: NextApiResponse): Promise<void> => {
  return new Promise((resolve, reject) => {
    console.log('Authenticating JWT...');
    const authHeader = req.headers.authorization;
    console.log('Authorization header:', authHeader);

    if (authHeader) {
      const token = authHeader.split(' ')[1];
      console.log('Extracted token:', token);


      const secret = process.env.POSTGRES_JWT_SECRET as string;
      if (!secret) {
        console.error('JWT secret not provided');
        res.status(500).json({ message: 'Internal server error: missing JWT secret' });
        return reject(new Error('Missing JWT secret'));
      }

      jwt.verify(token, secret, (err: any, user: any) => {
        if (err) {
          console.error('JWT verification failed:', err);
          res.status(403).json({ message: 'Invalid token' });
          return reject(err);
        }

        console.log('JWT verified successfully. User:', user);
        req.user = user;
        resolve();
      });
    } else {
      console.error('No authorization header found');
      res.status(401).json({ message: 'No token provided' });
      reject(new Error('No token provided'));
    }
  });
};
