import { NextApiResponse } from 'next';
import { authenticateJWT, AuthenticatedRequest } from '../../lib/auth';
import { pool } from '../../lib/db';

export default async function userHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    // Authenticate the request
    await authenticateJWT(req, res);

    // Fetch the authenticated user's details
    const result = await pool.query(
      'SELECT id, fullname, email FROM users WHERE id = $1',
      [req.user.id]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
