"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = loginHandler;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../../../lib/db");
async function loginHandler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;
        try {
            const result = await db_1.pool.query('SELECT * FROM USERS WHERE email = $1', [email]);
            const user = result.rows[0];
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }
            const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(400).json({ message: 'Invalid password' });
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.POSTGRES_JWT_SECRET, { expiresIn: '1hr' });
            res.json({ token, user: { id: user.id, fullname: user.fullname, email: user.email } });
        }
        catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
//# sourceMappingURL=login.js.map