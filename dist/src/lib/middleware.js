"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cors = exports.fetchUpcomingEvents = void 0;
exports.runMiddleware = runMiddleware;
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const cors = (0, cors_1.default)({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    origin: 'https://event-planner-nextjs-xi.vercel.app',
});
exports.cors = cors;
function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}
axios_1.default.interceptors.request.use(config => {
    console.log('Axios interceptor: Preparing request');
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token);
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log('Added Authorization header:', config.headers['Authorization']);
        }
        else {
            console.log('No token found in localStorage');
        }
    }
    return config;
}, error => {
    console.error('Axios interceptor error:', error);
    return Promise.reject(error);
});
const fetchUpcomingEvents = async () => {
    try {
        const response = await axios_1.default.get('/api/events/upcoming');
        return response.data;
    }
    catch (error) {
        console.error('Error fetching upcoming events:', error);
        throw error;
    }
};
exports.fetchUpcomingEvents = fetchUpcomingEvents;
//# sourceMappingURL=middleware.js.map