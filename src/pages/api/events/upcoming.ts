import { NextApiResponse } from 'next';
import { authenticateJWT, AuthenticatedRequest } from '../../../lib/auth';
import { pool } from '../../../lib/db';

export default async function upcomingEventsHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  await authenticateJWT(req, res, async () => {
    if (req.method === 'GET') {
      const page = parseInt(req.query.page as string) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      try {
        const result = await pool.query(`
          SELECT e.*, u.fullname as created_by, 
            (SELECT COUNT(*) FROM rsvps WHERE event_id = e.id AND status = 'attending') as attendee_count
          FROM events e
          LEFT JOIN users u ON e.user_id = u.id
          WHERE e.date >= CURRENT_DATE
          ORDER BY e.date ASC
          LIMIT $1 OFFSET $2
        `, [limit, offset]);

        const totalCount = await pool.query('SELECT COUNT(*) FROM events WHERE date >= CURRENT_DATE');

        res.json({
          events: result.rows,
          totalPages: Math.ceil(totalCount.rows[0].count / limit),
          currentPage: page
        });
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  });
}
