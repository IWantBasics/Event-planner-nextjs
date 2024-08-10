import type { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../../lib/db';
import { cors, runMiddleware } from '../../../lib/cors';

export default async function upcomingEventsHandler(req: NextApiRequest, res: NextApiResponse) {
  // Run CORS middleware
  await runMiddleware(req, res, cors);

  // Check for authentication (example code, adjust as needed)
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer your-token-here') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const query = `
        SELECT events.*, users.fullname as created_by, 
        (SELECT COUNT(*) FROM rsvps WHERE rsvps.event_id = events.id AND rsvps.status = 'attending') as attendee_count
        FROM events 
        JOIN users ON events.user_id = users.id 
        WHERE events.date >= CURRENT_DATE
        ORDER BY events.date ASC
      `;

      const result = await pool.query(query);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No upcoming events found' });
      }

      res.json(result.rows);
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
