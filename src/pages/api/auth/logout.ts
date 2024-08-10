import { NextApiRequest, NextApiResponse } from 'next';

export default function logoutHandler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: 'Logged out successfully' });
}
