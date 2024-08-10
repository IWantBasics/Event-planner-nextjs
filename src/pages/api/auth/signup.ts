import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../../../lib/db';

export default async function signupHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { fullname, email, password } = req.body;

    try {
      const existingUser = await pool.query('SELECT * FROM USERS WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'INSERT INTO USERS (fullname, email, password) VALUES ($1, $2, $3) RETURNING *',
        [fullname, email, hashedPassword]
      );

      const user = result.rows[0];
      const token = jwt.sign({ id: user.id }, process.env.POSTGRES_JWT_SECRET as string, { expiresIn: '1hr' });

      res.status(201).json({ token, user: { id: user.id, fullname: user.fullname, email: user.email } });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
