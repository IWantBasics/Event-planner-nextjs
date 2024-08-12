import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateJWT, AuthenticatedRequest } from '../../../../lib/auth';
import { pool } from '../../../../lib/db';

export default async function joinEventHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    await authenticateJWT(req, res);

    const { id } = req.query;

    if (req.method === 'POST') {
      try {
        const existingRSVP = await pool.query('SELECT * FROM rsvps WHERE event_id = $1 AND user_id = $2', [id, req.user.id]);
        if (existingRSVP.rows.length > 0) {
          return res.status(400).json({ message: 'You have already joined this event' });
        }

        await pool.query('INSERT INTO rsvps (event_id, user_id, status) VALUES ($1, $2, $3)', [id, req.user.id, 'attending']);
        
        await pool.query('UPDATE events SET attendee_count = attendee_count + 1 WHERE id = $1', [id]);

        res.status(200).json({ message: 'Joined event successfully' });
      } catch (error) {
        console.error('Error joining event:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
}
