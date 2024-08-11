"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateJWT = (req, res) => {
    return new Promise((resolve, reject) => {
        console.log('Authenticating JWT...');
        const authHeader = req.headers.authorization;
        console.log('Authorization header:', authHeader);
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            console.log('Extracted token:', token);
            jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => {
                if (err) {
                    console.error('JWT verification failed:', err);
                    res.status(403).json({ message: 'Invalid token' });
                    return reject(err);
                }
                console.log('JWT verified successfully. User:', user);
                req.user = user;
                resolve();
            });
        }
        else {
            console.error('No authorization header found');
            res.status(401).json({ message: 'No token provided' });
            reject(new Error('No token provided'));
        }
    });
};
exports.authenticateJWT = authenticateJWT;
//# sourceMappingURL=auth.js.map