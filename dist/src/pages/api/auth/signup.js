"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = signupHandler;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../../../lib/db");
async function signupHandler(req, res) {
    if (req.method === 'POST') {
        const { fullname, email, password } = req.body;
        try {
            const existingUser = await db_1.pool.query('SELECT * FROM USERS WHERE email = $1', [email]);
            if (existingUser.rows.length > 0) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const result = await db_1.pool.query('INSERT INTO USERS (fullname, email, password) VALUES ($1, $2, $3) RETURNING *', [fullname, email, hashedPassword]);
            const user = result.rows[0];
            const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.POSTGRES_JWT_SECRET, { expiresIn: '1hr' });
            res.status(201).json({ token, user: { id: user.id, fullname: user.fullname, email: user.email } });
        }
        catch (error) {
            res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
        }
    }
    else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
//# sourceMappingURL=signup.js.map