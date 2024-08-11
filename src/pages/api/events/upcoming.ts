import type { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../../lib/db';
import { cors, runMiddleware } from '../../../lib/cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`[INFO] Incoming request: ${req.method} ${req.url}`);
  console.log(`[INFO] Request headers: ${JSON.stringify(req.headers)}`);

  try {
    // Run CORS middleware
    await runMiddleware(req, res, cors);
    console.log(`[INFO] CORS middleware executed successfully.`);
  } catch (error) {
    console.error(`[ERROR] CORS middleware failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return res.status(500).json({ message: 'CORS middleware error' });
  }

  if (req.method === 'GET') {
    try {
      console.log(`[INFO] Executing SQL query...`);
      const query = `
        SELECT events.*, users.fullname as created_by, 
        (SELECT COUNT(*) FROM rsvps WHERE rsvps.event_id = events.id AND rsvps.status = 'attending') as attendee_count
        FROM events 
        JOIN users ON events.user_id = users.id 
        WHERE events.date >= CURRENT_DATE
        ORDER BY events.date ASC
      `;

      console.log(`[INFO] SQL Query: ${query}`);
      const result = await pool.query(query);
      console.log(`[INFO] SQL Query executed successfully.`);

      if (result.rows.length === 0) {
        console.log(`[INFO] No upcoming events found.`);
        return res.status(404).json({ message: 'No upcoming events found' });
      }

      console.log(`[INFO] Upcoming events found: ${JSON.stringify(result.rows)}`);
      res.json(result.rows);
    } catch (error) {
      console.error(`[ERROR] SQL query execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    console.log(`[INFO] Method ${req.method} not allowed.`);
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
