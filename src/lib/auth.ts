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

      jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
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
