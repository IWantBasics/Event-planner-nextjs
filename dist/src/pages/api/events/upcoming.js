"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = upcomingEventsHandler;
const db_1 = require("../../../lib/db");
async function upcomingEventsHandler(req, res) {
    if (req.method === 'GET') {
        try {
            const result = await db_1.pool.query(`
        SELECT e.*, u.fullname as created_by
        FROM events e
        LEFT JOIN users u ON e.user_id = u.id
        WHERE e.date >= CURRENT_DATE
        ORDER BY e.date ASC
        LIMIT 10
      `);
            res.json(result.rows);
        }
        catch (error) {
            console.error('Error in upcomingEventsHandler:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
//# sourceMappingURL=upcoming.js.map