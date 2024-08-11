import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateJWT, AuthenticatedRequest } from '../../../../lib/auth';
import { pool } from '../../../../lib/db';

export default async function leaveEventHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    await authenticateJWT(req, res);

    const { id } = req.query;

    if (req.method === 'POST') {
      try {
        // Delete the RSVP record
        const result = await pool.query('DELETE FROM rsvps WHERE event_id = $1 AND user_id = $2 RETURNING *', [id, req.user.id]);
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'You have not joined this event or it does not exist' });
        }

        // Decrement the attendee count in the events table
        await pool.query('UPDATE events SET attendee_count = attendee_count - 1 WHERE id = $1', [id]);

        res.status(200).json({ message: 'Left event successfully' });
      } catch (error) {
        console.error('Error leaving event:', error);
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
