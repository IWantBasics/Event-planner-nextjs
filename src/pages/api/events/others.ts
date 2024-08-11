import { NextApiResponse } from 'next';
import { authenticateJWT, AuthenticatedRequest } from '../../../lib/auth';
import { pool } from '../../../lib/db';

export default async function othersEventsHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    await authenticateJWT(req, res);

    if (req.method === 'GET') {
      try {
        const result = await pool.query(`
          SELECT e.*, u.fullname as created_by,
          (SELECT COUNT(*) FROM rsvps WHERE rsvps.event_id = e.id AND rsvps.status = 'attending') as attendee_count
          FROM events e
          JOIN users u ON e.created_by = u.id
          WHERE e.created_by != $1
        `, [req.user.id]);

        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'No events found' });
        }

        res.json(result.rows);
      } catch (error) {
        console.error('Error fetching events created by others:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
}
