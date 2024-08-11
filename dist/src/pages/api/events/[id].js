"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = eventDetailsHandler;
const auth_1 = require("../../../lib/auth");
const db_1 = require("../../../lib/db");
async function eventDetailsHandler(req, res) {
    try {
        await (0, auth_1.authenticateJWT)(req, res);
        const { id } = req.query;
        if (req.method === 'GET') {
            try {
                const result = await db_1.pool.query(`
          SELECT e.*, u.fullname as created_by,
          (SELECT json_agg(json_build_object('id', a.id, 'name', a.fullname))
          FROM rsvps r
          JOIN users a ON r.user_id = a.id
          WHERE r.event_id = e.id AND r.status = 'attending'
          ) as attendees
          FROM events e
          LEFT JOIN users u ON e.user_id = u.id
          WHERE e.id = $1
        `, [id]);
                if (result.rows.length === 0) {
                    return res.status(404).json({ message: 'Event not found' });
                }
                res.json(result.rows[0]);
            }
            catch (error) {
                console.error('Error fetching event:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
        else if (req.method === 'DELETE') {
            try {
                const result = await db_1.pool.query('DELETE FROM events WHERE id = $1 AND user_id = $2 RETURNING *', [id, req.user.id]);
                if (result.rows.length === 0) {
                    return res.status(404).json({ message: 'Event not found or you do not have permission to delete it' });
                }
                res.json({ message: 'Event deleted successfully' });
            }
            catch (error) {
                console.error('Error deleting event:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
        else if (req.method === 'PUT') {
            const { name, date, description, location } = req.body;
            try {
                const result = await db_1.pool.query('UPDATE events SET name = $1, date = $2, description = $3, location = $4 WHERE id = $5 AND user_id = $6 RETURNING *', [name, date, description, location, id, req.user.id]);
                if (result.rows.length === 0) {
                    return res.status(404).json({ message: 'Event not found or you do not have permission to update it' });
                }
                res.json(result.rows[0]);
            }
            catch (error) {
                console.error('Error updating event:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
        else {
            res.setHeader('Allow', ['GET', 'DELETE', 'PUT']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Authentication failed' });
    }
}
//# sourceMappingURL=%5Bid%5D.js.map