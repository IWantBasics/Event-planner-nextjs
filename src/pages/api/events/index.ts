import { NextApiResponse } from 'next';
import { authenticateJWT, AuthenticatedRequest } from '../../../lib/auth';
import { pool } from '../../../lib/db';

export default async function eventsHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    // Authenticate the request
    await authenticateJWT(req, res);

    // Handle GET requests
    if (req.method === 'GET') {
      try {
        const result = await pool.query(
          'SELECT events.*, users.fullname as created_by FROM events JOIN users ON events.created_by = users.id WHERE events.created_by = $1', 
          [req.user.id]
        );
        res.json(result.rows);
      } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } 
    // Handle POST requests
    else if (req.method === 'POST') {
      try {
        const { name, date, description, location } = req.body;
        const userId = req.user.id;

        console.log('Creating event with data:', { name, date, description, location, userId });

        const result = await pool.query(
          'INSERT INTO events (name, date, description, location, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [name, date, description, location, userId]
        );

        res.status(201).json(result.rows[0]);
      } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } 
    // Handle other HTTP methods
    else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (authError) {
    console.error('Authentication error:', authError);
    res.status(403).json({ message: 'Forbidden: Authentication failed' });
  }
}
