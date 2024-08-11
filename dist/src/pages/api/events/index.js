"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getAllEventsHandler;
const auth_1 = require("../../../lib/auth");
const db_1 = require("../../../lib/db");
async function getAllEventsHandler(req, res) {
    if (req.method === 'GET') {
        try {
            await (0, auth_1.authenticateJWT)(req, res);
            const result = await db_1.pool.query('SELECT events.*, users.fullname as created_by FROM events JOIN users ON events.user_id = users.id WHERE events.user_id = $1', [req.user.id]);
            res.json(result.rows);
        }
        catch (error) {
            console.error('Error fetching events:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
//# sourceMappingURL=index.js.map