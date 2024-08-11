import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateJWT, AuthenticatedRequest } from '../../../lib/auth';
import { pool } from '../../../lib/db';

export default async function eventDetailsHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  authenticateJWT(req, res, async () => {
    const { id, offset = 0, limit = 20 } = req.query;

    if (req.method === 'GET') {
      try {
        const eventResult = await pool.query(
          'SELECT events.*, users.fullname as created_by FROM events JOIN users ON events.user_id = users.id ORDER BY events.date OFFSET $1 LIMIT $2',
          [offset, limit]
        );

        if (eventResult.rows.length === 0) {
          return res.status(404).json({ message: 'Event not found' });
        }

        const event = eventResult.rows[0];

        // Get attendees
        const attendeesResult = await pool.query(
          'SELECT users.id, users.fullname as name FROM rsvps JOIN users ON rsvps.user_id = users.id WHERE rsvps.event_id = $1 AND rsvps.status = $2',
          [id, 'attending']
        );

        event.attendees = attendeesResult.rows;

        res.json(event);
      } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
      }
    } else if (req.method === 'DELETE') {
      try {
        const result = await pool.query('DELETE FROM events WHERE id = $1 AND user_id = $2 RETURNING *', [id, req.user.id]);
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Event not found or you do not have permission to delete it' });
        }
        res.json({ message: 'Event deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
      }
    } else if (req.method === 'PUT') {
      const { name, date, description, location } = req.body;
      try {
        const result = await pool.query(
          'UPDATE events SET name = $1, date = $2, description = $3, location = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
          [name, date, description, location, id, req.user.id]
        );
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Event not found or you do not have permission to update it' });
        }
        res.json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.setHeader('Allow', ['GET', 'DELETE', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  });
}
