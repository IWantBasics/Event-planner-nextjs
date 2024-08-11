import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateJWT, AuthenticatedRequest } from '../../../../lib/auth';
import { pool } from '../../../../lib/db';

export default async function messagesHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    await authenticateJWT(req, res);

    const { id } = req.query;

    if (req.method === 'GET') {
      try {
        const result = await pool.query(
          'SELECT messages.*, users.fullname as sender FROM messages JOIN users ON messages.user_id = users.id WHERE messages.event_id = $1 ORDER BY messages.timestamp',
          [id]
        );

        res.json(result.rows);
      } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else if (req.method === 'POST') {
      const { message } = req.body;

      try {
        const result = await pool.query(
          'INSERT INTO messages (event_id, user_id, message) VALUES ($1, $2, $3) RETURNING *',
          [id, req.user.id, message]
        );

        res.status(201).json(result.rows[0]);
      } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
}
