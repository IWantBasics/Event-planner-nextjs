import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pg from 'pg';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// cors allow credentials 
app.use(cors({
  origin: 'http://localhost:3002', // Frontend URL
  credentials: true,
}));

app.use(bodyParser.json());

const { Pool } = pg;
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

interface AuthenticatedRequest extends Request {
  user?: any;
}

// Middleware to verify JWT token and set user in request
const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    jwt.verify(token, process.env.POSTGRES_JWT_SECRET as string, (err: any, user: any) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Fetch upcoming events endpoint
app.get('/api/events/upcoming', async (req: Request, res: Response) => {
  try {
    console.log('Fetching upcoming events...');
    
    const query = `
      SELECT events.*, users.fullname as created_by, 
      (SELECT COUNT(*) FROM rsvps WHERE rsvps.event_id = events.id AND rsvps.status = 'attending') as attendee_count
      FROM events 
      JOIN users ON events.user_id = users.id 
      WHERE events.date >= CURRENT_DATE
      ORDER BY events.date ASC
    `;

    console.log('Query to be executed:', query);

    const result = await pool.query(query);
    
    console.log('Result from the database:', result.rows);

    if (result.rows.length === 0) {
      console.log('No upcoming events found');
      return res.status(404).json({ message: 'No upcoming events found' });
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Signup route
app.post('/api/signup', async (req: Request, res: Response) => {
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
    console.log('User created:', { id: user.id, fullname: user.fullname, email: user.email });
    res.status(201).json({ token, user: { id: user.id, fullname: user.fullname, email: user.email } });
  } catch (error) {
    console.error('Error during user signup:', error);
    res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Login route
app.post('/api/login', async (req: Request, res: Response) => {
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

    console.log('User logged in:', { id: user.id, fullname: user.fullname, email: user.email });
    res.json({ token, user: { id: user.id, fullname: user.fullname, email: user.email } });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout route
app.post('/api/logout', (req: Request, res: Response) => {
  console.log('Logout route hit');
  res.status(200).json({ message: 'Logged out successfully' });
});

// Get user info route
app.get('/api/user', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT id, fullname, email FROM USERS WHERE id = $1', [req.user.id]);
    const user = result.rows[0];
    console.log('User data sent from server:', user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create event endpoint
app.post('/api/events', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const { name, date, description, location } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO events (name, date, description, location, user_id, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, date, description, location, req.user.id, req.user.fullname]
    );
    console.log('Event created:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get events created by other users
app.get('/api/events/others', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT events.*, users.fullname as created_by, ' +
      '(SELECT COUNT(*) FROM rsvps WHERE rsvps.event_id = events.id AND rsvps.status = $2) as attendee_count ' +
      'FROM events ' +
      'JOIN users ON events.user_id = users.id ' +
      'WHERE events.user_id != $1',
      [req.user.id, 'attending']
    );
    console.log('Events created by other users fetched for user:', req.user.id);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching events created by other users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all events endpoint
app.get('/api/events', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT events.*, users.fullname as created_by FROM events JOIN users ON events.user_id = users.id WHERE events.user_id = $1', [req.user.id]);
    console.log('All events fetched for user:', req.user.id);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get event details endpoint
app.get('/api/events/:id', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    const eventResult = await pool.query(
      'SELECT events.*, users.fullname as created_by FROM events JOIN users ON events.user_id = users.id WHERE events.id = $1',
      [id]
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
    console.error('Error fetching event details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Join event endpoint
app.post('/api/events/join/:id', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  console.log(`Attempting to join event ${id} for user ${req.user.id}`);

  try {
    // Check if the user has already joined the event
    const existingRSVP = await pool.query('SELECT * FROM rsvps WHERE event_id = $1 AND user_id = $2', [id, req.user.id]);
    if (existingRSVP.rows.length > 0) {
      console.error(`User ${req.user.id} has already joined event ${id}`);
      return res.status(400).json({ message: 'You have already joined this event' });
    }

    // Insert a new RSVP record
    const rsvpInsertResult = await pool.query('INSERT INTO rsvps (event_id, user_id, status) VALUES ($1, $2, $3)', [id, req.user.id, 'attending']);
    console.log(`RSVP insert result: ${JSON.stringify(rsvpInsertResult.rows)}`);
    console.log(`User ${req.user.id} successfully joined event ${id}`);

    // Increment the attendee count in the events table
    const updateResult = await pool.query('UPDATE events SET attendee_count = attendee_count + 1 WHERE id = $1 RETURNING attendee_count', [id]);
    console.log(`Update attendee count result: ${JSON.stringify(updateResult.rows)}`);

    // Fetch the updated event details
    const updatedEvent = await pool.query(
      `SELECT events.*, users.fullname as created_by, 
      (SELECT COUNT(*) FROM rsvps WHERE rsvps.event_id = events.id AND rsvps.status = 'attending') as attendee_count
      FROM events 
      JOIN users ON events.user_id = users.id 
      WHERE events.id = $1`,
      [id]
    );
    console.log(`Updated event details: ${JSON.stringify(updatedEvent.rows[0])}`);

    // Return the updated event details
    res.status(200).json({ message: 'Joined event successfully', event: updatedEvent.rows[0] });

  } catch (error) {
    console.error('Error joining event:', error);
    res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Leave event endpoint
app.post('/api/events/leave/:id', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM rsvps WHERE event_id = $1 AND user_id = $2 RETURNING *', [id, req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'You have not joined this event or it does not exist' });
    }
    console.log(`User ${req.user.id} left event ${id}`);
    res.status(200).json({ message: 'Left event successfully' });
  } catch (error) {
    console.error('Error leaving event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Send message endpoint
app.post('/api/events/:id/messages', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
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
});

// Get all messages for an event
app.get('/api/events/:id/messages', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

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
});

// Update event endpoint
app.put('/api/events/:id', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, date, description, location } = req.body;

  try {
    const result = await pool.query(
      'UPDATE events SET name = $1, date = $2, description = $3, location = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
      [name, date, description, location, id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found or you do not have permission to update it' });
    }
    console.log('Event updated:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete event endpoint
app.delete('/api/events/:id', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM events WHERE id = $1 AND user_id = $2 RETURNING *', [id, req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found or you do not have permission to delete it' });
    }
    console.log('Event deleted:', result.rows[0]);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Test route
app.get('/api/test', (req: Request, res: Response) => {
  res.json({ message: "This is a test route." });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
