"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cors = void 0;
exports.runMiddleware = runMiddleware;
const cors_1 = __importDefault(require("cors"));
// Initialize the CORS middleware with detailed logging
exports.cors = (0, cors_1.default)({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    origin: (origin, callback) => {
        console.log(`[CORS] Incoming request from origin: ${origin}`);
        const allowedOrigins = [
            'https://event-planner-nextjs-xi.vercel.app',
            'https://event-planner-nextjs-xi.vercel.app/',
            'https://event-planner-nextjs-git-main-iwantbasics-projects.vercel.app',
            'https://event-planner-nextjs-d1souicsb-iwantbasics-projects.vercel.app',
            'https://event-planner-nextjs-97z1bxo6t-iwantbasics-projects.vercel.app',
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            console.log(`[CORS] Origin ${origin} is allowed.`);
            callback(null, true);
        }
        else {
            console.log(`[CORS] Origin ${origin} is not allowed.`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
});
// Helper function to run middleware with detailed logging
function runMiddleware(req, res, fn) {
    console.log('[Middleware] Running middleware...');
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                console.error('[Middleware] Middleware error:', result.message);
                return reject(result);
            }
            console.log('[Middleware] Middleware completed successfully.');
            return resolve(result);
        });
    });
}
//# sourceMappingURL=cors.js.map