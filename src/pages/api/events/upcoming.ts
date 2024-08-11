import { NextApiResponse } from 'next';
import { authenticateJWT, AuthenticatedRequest } from '../../../lib/auth';
import { pool } from '../../../lib/db';

export default async function upcomingEventsHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    await authenticateJWT(req, res);
    if (req.method === 'GET') {
      const result = await pool.query(`
        SELECT e.*, u.fullname as created_by
        FROM events e
        LEFT JOIN users u ON e.user_id = u.id
        WHERE e.date >= CURRENT_DATE
        ORDER BY e.date ASC
        LIMIT 10
      `);
      res.json(result.rows);
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in upcomingEventsHandler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
