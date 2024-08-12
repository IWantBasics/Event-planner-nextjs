import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../../lib/db';
import { cors, runMiddleware } from '../../../lib/cors';

export default async function upcomingEventsHandler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors);

  if (req.method === 'GET') {
    try {
      const query = `
        SELECT e.*, u.fullname as created_by,
        (SELECT COUNT(*) FROM rsvps WHERE rsvps.event_id = e.id AND rsvps.status = 'attending') as attendee_count
        FROM events e
        LEFT JOIN users u ON e.created_by = u.id
        WHERE e.date >= CURRENT_DATE
        ORDER BY e.date ASC
        LIMIT 10
      `;

      const result = await pool.query(query);

      console.log('Query result:', result.rows);

      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Detailed error in upcomingEventsHandler:', error);

      res.status(500).json({ 
        message: 'Internal server error', 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.stack : undefined : undefined
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
