import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../../../lib/db';

export default async function loginHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      const result = await pool.query('SELECT * FROM USERS WHERE email = $1', [email]);
      const user = result.rows[0];

      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Invalid password' });
      }

      const token = jwt.sign({ id: user.id }, process.env.POSTGRES_JWT_SECRET as string, { expiresIn: '1hr' });

      res.json({ token, user: { id: user.id, fullname: user.fullname, email: user.email } });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
