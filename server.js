// "use strict";
// var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
//     function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
//     return new (P || (P = Promise))(function (resolve, reject) {
//         function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
//         function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
//         function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
//         step((generator = generator.apply(thisArg, _arguments || [])).next());
//     });
// };
// var __generator = (this && this.__generator) || function (thisArg, body) {
//     var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
//     return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
//     function verb(n) { return function (v) { return step([n, v]); }; }
//     function step(op) {
//         if (f) throw new TypeError("Generator is already executing.");
//         while (g && (g = 0, op[0] && (_ = 0)), _) try {
//             if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
//             if (y = 0, t) op = [op[0] & 2, t.value];
//             switch (op[0]) {
//                 case 0: case 1: t = op; break;
//                 case 4: _.label++; return { value: op[1], done: false };
//                 case 5: _.label++; y = op[1]; op = [0]; continue;
//                 case 7: op = _.ops.pop(); _.trys.pop(); continue;
//                 default:
//                     if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
//                     if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
//                     if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
//                     if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
//                     if (t[2]) _.ops.pop();
//                     _.trys.pop(); continue;
//             }
//             op = body.call(thisArg, _);
//         } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
//         if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
//     }
// };
// Object.defineProperty(exports, "__esModule", { value: true });
// var express_1 = require("express");
// var body_parser_1 = require("body-parser");
// var bcryptjs_1 = require("bcryptjs");
// var jsonwebtoken_1 = require("jsonwebtoken");
// var pg_1 = require("pg");
// var dotenv_1 = require("dotenv");
// var cors_1 = require("cors");
// dotenv_1.default.config();
// var app = (0, express_1.default)();
// var port = process.env.PORT || 3000;
// var allowedOrigins = [
//     'http://localhost:3000', // Local development
//     'https://event-planner-zca7.vercel.app' // Vercel deployment
// ];
// app.use((0, cors_1.default)({
//     origin: function (origin, callback) {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         }
//         else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     credentials: true,
// }));
// app.use(body_parser_1.default.json());
// var Pool = pg_1.default.Pool;
// var pool = new Pool({
//     user: process.env.POSTGRES_USER,
//     host: process.env.POSTGRES_HOST,
//     database: process.env.POSTGRES_DB,
//     password: process.env.POSTGRES_PASSWORD,
//     port: Number(process.env.POSTGRES_PORT),
// });
// // Test database connection
// pool.query('SELECT NOW()', function (err, res) {
//     if (err) {
//         console.error('Database connection error:', err);
//     }
//     else {
//         console.log('Database connected successfully');
//     }
// });
// // Middleware to verify JWT token and set user in request
// var authenticateJWT = function (req, res, next) {
//     var _a;
//     var token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
//     if (token) {
//         jsonwebtoken_1.default.verify(token, process.env.POSTGRES_JWT_SECRET, function (err, user) {
//             if (err) {
//                 return res.sendStatus(403);
//             }
//             req.user = user;
//             next();
//         });
//     }
//     else {
//         res.sendStatus(401);
//     }
// };
// // Fetch upcoming events endpoint
// app.get('/api/events/upcoming', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
//     var query, result, error_1;
//     return __generator(this, function (_a) {
//         switch (_a.label) {
//             case 0:
//                 _a.trys.push([0, 2, , 3]);
//                 console.log('Fetching upcoming events...');
//                 query = "\n      SELECT events.*, users.fullname as created_by, \n      (SELECT COUNT(*) FROM rsvps WHERE rsvps.event_id = events.id AND rsvps.status = 'attending') as attendee_count\n      FROM events \n      JOIN users ON events.user_id = users.id \n      WHERE events.date >= CURRENT_DATE\n      ORDER BY events.date ASC\n    ";
//                 console.log('Query to be executed:', query);
//                 return [4 /*yield*/, pool.query(query)];
//             case 1:
//                 result = _a.sent();
//                 console.log('Result from the database:', result.rows);
//                 if (result.rows.length === 0) {
//                     console.log('No upcoming events found');
//                     return [2 /*return*/, res.status(404).json({ message: 'No upcoming events found' })];
//                 }
//                 res.json(result.rows);
//                 return [3 /*break*/, 3];
//             case 2:
//                 error_1 = _a.sent();
//                 console.error('Detailed error:', error_1);
//                 res.status(500).json({ message: 'Internal server error', error: error_1 instanceof Error ? error_1.message : 'Unknown error' });
//                 return [3 /*break*/, 3];
//             case 3: return [2 /*return*/];
//         }
//     });
// }); });
// // Signup route
// app.post('/api/signup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
//     var _a, fullname, email, password, existingUser, hashedPassword, result, user, token, error_2;
//     return __generator(this, function (_b) {
//         switch (_b.label) {
//             case 0:
//                 _a = req.body, fullname = _a.fullname, email = _a.email, password = _a.password;
//                 _b.label = 1;
//             case 1:
//                 _b.trys.push([1, 5, , 6]);
//                 return [4 /*yield*/, pool.query('SELECT * FROM USERS WHERE email = $1', [email])];
//             case 2:
//                 existingUser = _b.sent();
//                 if (existingUser.rows.length > 0) {
//                     return [2 /*return*/, res.status(400).json({ message: 'Email already in use' })];
//                 }
//                 return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
//             case 3:
//                 hashedPassword = _b.sent();
//                 return [4 /*yield*/, pool.query('INSERT INTO USERS (fullname, email, password) VALUES ($1, $2, $3) RETURNING *', [fullname, email, hashedPassword])];
//             case 4:
//                 result = _b.sent();
//                 user = result.rows[0];
//                 token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.POSTGRES_JWT_SECRET, { expiresIn: '1hr' });
//                 console.log('User created:', { id: user.id, fullname: user.fullname, email: user.email });
//                 res.status(201).json({ token: token, user: { id: user.id, fullname: user.fullname, email: user.email } });
//                 return [3 /*break*/, 6];
//             case 5:
//                 error_2 = _b.sent();
//                 console.error('Error during user signup:', error_2);
//                 res.status(500).json({ message: 'Internal server error', error: error_2 instanceof Error ? error_2.message : 'Unknown error' });
//                 return [3 /*break*/, 6];
//             case 6: return [2 /*return*/];
//         }
//     });
// }); });
// // Login route
// app.post('/api/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
//     var _a, email, password, result, user, isValidPassword, token, error_3;
//     return __generator(this, function (_b) {
//         switch (_b.label) {
//             case 0:
//                 _a = req.body, email = _a.email, password = _a.password;
//                 _b.label = 1;
//             case 1:
//                 _b.trys.push([1, 4, , 5]);
//                 return [4 /*yield*/, pool.query('SELECT * FROM USERS WHERE email = $1', [email])];
//             case 2:
//                 result = _b.sent();
//                 user = result.rows[0];
//                 if (!user) {
//                     return [2 /*return*/, res.status(400).json({ message: 'User not found' })];
//                 }
//                 return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
//             case 3:
//                 isValidPassword = _b.sent();
//                 if (!isValidPassword) {
//                     return [2 /*return*/, res.status(400).json({ message: 'Invalid password' })];
//                 }
//                 token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.POSTGRES_JWT_SECRET, { expiresIn: '1hr' });
//                 console.log('User logged in:', { id: user.id, fullname: user.fullname, email: user.email });
//                 res.json({ token: token, user: { id: user.id, fullname: user.fullname, email: user.email } });
//                 return [3 /*break*/, 5];
//             case 4:
//                 error_3 = _b.sent();
//                 console.error('Error during login:', error_3);
//                 res.status(500).json({ message: 'Internal server error' });
//                 return [3 /*break*/, 5];
//             case 5: return [2 /*return*/];
//         }
//     });
// }); });
// // Logout route
// app.post('/api/logout', function (req, res) {
//     console.log('Logout route hit');
//     res.status(200).json({ message: 'Logged out successfully' });
// });
// // Get user info route
// app.get('/api/user', authenticateJWT, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
//     var result, user, error_4;
//     return __generator(this, function (_a) {
//         switch (_a.label) {
//             case 0:
//                 _a.trys.push([0, 2, , 3]);
//                 return [4 /*yield*/, pool.query('SELECT id, fullname, email FROM USERS WHERE id = $1', [req.user.id])];
//             case 1:
//                 result = _a.sent();
//                 user = result.rows[0];
//                 console.log('User data sent from server:', user);
//                 if (!user) {
//                     return [2 /*return*/, res.status(404).json({ message: 'User not found' })];
//                 }
//                 res.json(user);
//                 return [3 /*break*/, 3];
//             case 2:
//                 error_4 = _a.sent();
//                 console.error('Error fetching user:', error_4);
//                 res.status(500).json({ message: 'Internal server error' });
//                 return [3 /*break*/, 3];
//             case 3: return [2 /*return*/];
//         }
//     });
// }); });
// // Create event endpoint
// app.post('/api/events', authenticateJWT, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
//     var _a, name, date, description, location, result, error_5;
//     return __generator(this, function (_b) {
//         switch (_b.label) {
//             case 0:
//                 _a = req.body, name = _a.name, date = _a.date, description = _a.description, location = _a.location;
//                 _b.label = 1;
//             case 1:
//                 _b.trys.push([1, 3, , 4]);
//                 return [4 /*yield*/, pool.query('INSERT INTO events (name, date, description, location, user_id, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [name, date, description, location, req.user.id, req.user.fullname])];
//             case 2:
//                 result = _b.sent();
//                 console.log('Event created:', result.rows[0]);
//                 res.status(201).json(result.rows[0]);
//                 return [3 /*break*/, 4];
//             case 3:
//                 error_5 = _b.sent();
//                 console.error('Error creating event:', error_5);
//                 res.status(500).json({ message: 'Internal server error', error: error_5 instanceof Error ? error_5.message : 'Unknown error' });
//                 return [3 /*break*/, 4];
//             case 4: return [2 /*return*/];
//         }
//     });
// }); });
// // Get events created by other users
// app.get('/api/events/others', authenticateJWT, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
//     var result, error_6;
//     return __generator(this, function (_a) {
//         switch (_a.label) {
//             case 0:
//                 _a.trys.push([0, 2, , 3]);
//                 return [4 /*yield*/, pool.query('SELECT events.*, users.fullname as created_by, ' +
//                         '(SELECT COUNT(*) FROM rsvps WHERE rsvps.event_id = events.id AND rsvps.status = $2) as attendee_count ' +
//                         'FROM events ' +
//                         'JOIN users ON events.user_id = users.id ' +
//                         'WHERE events.user_id != $1', [req.user.id, 'attending'])];
//             case 1:
//                 result = _a.sent();
//                 console.log('Events created by other users fetched for user:', req.user.id);
//                 res.json(result.rows);
//                 return [3 /*break*/, 3];
//             case 2:
//                 error_6 = _a.sent();
//                 console.error('Error fetching events created by other users:', error_6);
//                 res.status(500).json({ message: 'Internal server error' });
//                 return [3 /*break*/, 3];
//             case 3: return [2 /*return*/];
//         }
//     });
// }); });
// // Get all events endpoint
// app.get('/api/events', authenticateJWT, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
//     var result, error_7;
//     return __generator(this, function (_a) {
//         switch (_a.label) {
//             case 0:
//                 _a.trys.push([0, 2, , 3]);
//                 return [4 /*yield*/, pool.query('SELECT events.*, users.fullname as created_by FROM events JOIN users ON events.user_id = users.id WHERE events.user_id = $1', [req.user.id])];
//             case 1:
//                 result = _a.sent();
//                 console.log('All events fetched for user:', req.user.id);
//                 res.json(result.rows);
//                 return [3 /*break*/, 3];
//             case 2:
//                 error_7 = _a.sent();
//                 console.error('Error fetching events:', error_7);
//                 res.status(500).json({ message: 'Internal server error' });
//                 return [3 /*break*/, 3];
//             case 3: return [2 /*return*/];
//         }
//     });
// }); });
// // Get event details endpoint
// app.get('/api/events/:id', authenticateJWT, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
//     var id, eventResult, event_1, attendeesResult, error_8;
//     return __generator(this, function (_a) {
//         switch (_a.label) {
//             case 0:
//                 id = req.params.id;
//                 _a.label = 1;
//             case 1:
//                 _a.trys.push([1, 4, , 5]);
//                 return [4 /*yield*/, pool.query('SELECT events.*, users.fullname as created_by FROM events JOIN users ON events.user_id = users.id WHERE events.id = $1', [id])];
//             case 2:
//                 eventResult = _a.sent();
//                 if (eventResult.rows.length === 0) {
//                     return [2 /*return*/, res.status(404).json({ message: 'Event not found' })];
//                 }
//                 event_1 = eventResult.rows[0];
//                 return [4 /*yield*/, pool.query('SELECT users.id, users.fullname as name FROM rsvps JOIN users ON rsvps.user_id = users.id WHERE rsvps.event_id = $1 AND rsvps.status = $2', [id, 'attending'])];
//             case 3:
//                 attendeesResult = _a.sent();
//                 event_1.attendees = attendeesResult.rows;
//                 res.json(event_1);
//                 return [3 /*break*/, 5];
//             case 4:
//                 error_8 = _a.sent();
//                 console.error('Error fetching event details:', error_8);
//                 res.status(500).json({ message: 'Internal server error' });
//                 return [3 /*break*/, 5];
//             case 5: return [2 /*return*/];
//         }
//     });
// }); });
// // Join event endpoint
// app.post('/api/events/join/:id', authenticateJWT, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
//     var id, existingRSVP, rsvpInsertResult, updateResult, updatedEvent, error_9;
//     return __generator(this, function (_a) {
//         switch (_a.label) {
//             case 0:
//                 id = req.params.id;
//                 console.log("Attempting to join event ".concat(id, " for user ").concat(req.user.id));
//                 _a.label = 1;
//             case 1:
//                 _a.trys.push([1, 6, , 7]);
//                 return [4 /*yield*/, pool.query('SELECT * FROM rsvps WHERE event_id = $1 AND user_id = $2', [id, req.user.id])];
//             case 2:
//                 existingRSVP = _a.sent();
//                 if (existingRSVP.rows.length > 0) {
//                     console.error("User ".concat(req.user.id, " has already joined event ").concat(id));
//                     return [2 /*return*/, res.status(400).json({ message: 'You have already joined this event' })];
//                 }
//                 return [4 /*yield*/, pool.query('INSERT INTO rsvps (event_id, user_id, status) VALUES ($1, $2, $3)', [id, req.user.id, 'attending'])];
//             case 3:
//                 rsvpInsertResult = _a.sent();
//                 console.log("RSVP insert result: ".concat(JSON.stringify(rsvpInsertResult.rows)));
//                 console.log("User ".concat(req.user.id, " successfully joined event ").concat(id));
//                 return [4 /*yield*/, pool.query('UPDATE events SET attendee_count = attendee_count + 1 WHERE id = $1 RETURNING attendee_count', [id])];
//             case 4:
//                 updateResult = _a.sent();
//                 console.log("Update attendee count result: ".concat(JSON.stringify(updateResult.rows)));
//                 return [4 /*yield*/, pool.query("SELECT events.*, users.fullname as created_by, \n      (SELECT COUNT(*) FROM rsvps WHERE rsvps.event_id = events.id AND rsvps.status = 'attending') as attendee_count\n      FROM events \n      JOIN users ON events.user_id = users.id \n      WHERE events.id = $1", [id])];
//             case 5:
//                 updatedEvent = _a.sent();
//                 console.log("Updated event details: ".concat(JSON.stringify(updatedEvent.rows[0])));
//                 // Return the updated event details
//                 res.status(200).json({ message: 'Joined event successfully', event: updatedEvent.rows[0] });
//                 return [3 /*break*/, 7];
//             case 6:
//                 error_9 = _a.sent();
//                 console.error('Error joining event:', error_9);
//                 res.status(500).json({ message: 'Internal server error', error: error_9 instanceof Error ? error_9.message : 'Unknown error' });
//                 return [3 /*break*/, 7];
//             case 7: return [2 /*return*/];
//         }
//     });
// }); });
// // Leave event endpoint
// app.post('/api/events/leave/:id', authenticateJWT, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
//     var id, result, error_10;
//     return __generator(this, function (_a) {
//         switch (_a.label) {
//             case 0:
//                 id = req.params.id;
//                 _a.label = 1;
//             case 1:
//                 _a.trys.push([1, 3, , 4]);
//                 return [4 /*yield*/, pool.query('DELETE FROM rsvps WHERE event_id = $1 AND user_id = $2 RETURNING *', [id, req.user.id])];
//             case 2:
//                 result = _a.sent();
//                 if (result.rows.length === 0) {
//                     return [2 /*return*/, res.status(404).json({ message: 'You have not joined this event or it does not exist' })];
//                 }
//                 console.log("User ".concat(req.user.id, " left event ").concat(id));
//                 res.status(200).json({ message: 'Left event successfully' });
//                 return [3 /*break*/, 4];
//             case 3:
//                 error_10 = _a.sent();
//                 console.error('Error leaving event:', error_10);
//                 res.status(500).json({ message: 'Internal server error' });
//                 return [3 /*break*/, 4];
//             case 4: return [2 /*return*/];
//         }
//     });
// }); });
// // Send message endpoint
// app.post('/api/events/:id/messages', authenticateJWT, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
//     var id, message, result, error_11;
//     return __generator(this, function (_a) {
//         switch (_a.label) {
//             case 0:
//                 id = req.params.id;
//                 message = req.body.message;
//                 _a.label = 1;
//             case 1:
//                 _a.trys.push([1, 3, , 4]);
//                 return [4 /*yield*/, pool.query('INSERT INTO messages (event_id, user_id, message) VALUES ($1, $2, $3) RETURNING *', [id, req.user.id, message])];
//             case 2:
//                 result = _a.sent();
//                 res.status(201).json(result.rows[0]);
//                 return [3 /*break*/, 4];
//             case 3:
//                 error_11 = _a.sent();
//                 console.error('Error sending message:', error_11);
//                 res.status(500).json({ message: 'Internal server error' });
//                 return [3 /*break*/, 4];
//             case 4: return [2 /*return*/];
//         }
//     });
// }); });
// // Get all messages for an event
// app.get('/api/events/:id/messages', authenticateJWT, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
//     var id, result, error_12;
//     return __generator(this, function (_a) {
//         switch (_a.label) {
//             case 0:
//                 id = req.params.id;
//                 _a.label = 1;
//             case 1:
//                 _a.trys.push([1, 3, , 4]);
//                 return [4 /*yield*/, pool.query('SELECT messages.*, users.fullname as sender FROM messages JOIN users ON messages.user_id = users.id WHERE messages.event_id = $1 ORDER BY messages.timestamp', [id])];
//             case 2:
//                 result = _a.sent();
//                 res.json(result.rows);
//                 return [3 /*break*/, 4];
//             case 3:
//                 error_12 = _a.sent();
//                 console.error('Error fetching messages:', error_12);
//                 res.status(500).json({ message: 'Internal server error' });
//                 return [3 /*break*/, 4];
//             case 4: return [2 /*return*/];
//         }
//     });
// }); });
// // Update event endpoint
// app.put('/api/events/:id', authenticateJWT, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
//     var id, _a, name, date, description, location, result, error_13;
//     return __generator(this, function (_b) {
//         switch (_b.label) {
//             case 0:
//                 id = req.params.id;
//                 _a = req.body, name = _a.name, date = _a.date, description = _a.description, location = _a.location;
//                 _b.label = 1;
//             case 1:
//                 _b.trys.push([1, 3, , 4]);
//                 return [4 /*yield*/, pool.query('UPDATE events SET name = $1, date = $2, description = $3, location = $4 WHERE id = $5 AND user_id = $6 RETURNING *', [name, date, description, location, id, req.user.id])];
//             case 2:
//                 result = _b.sent();
//                 if (result.rows.length === 0) {
//                     return [2 /*return*/, res.status(404).json({ message: 'Event not found or you do not have permission to update it' })];
//                 }
//                 console.log('Event updated:', result.rows[0]);
//                 res.json(result.rows[0]);
//                 return [3 /*break*/, 4];
//             case 3:
//                 error_13 = _b.sent();
//                 console.error('Error updating event:', error_13);
//                 res.status(500).json({ message: 'Internal server error' });
//                 return [3 /*break*/, 4];
//             case 4: return [2 /*return*/];
//         }
//     });
// }); });
// // Delete event endpoint
// app.delete('/api/events/:id', authenticateJWT, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
//     var id, result, error_14;
//     return __generator(this, function (_a) {
//         switch (_a.label) {
//             case 0:
//                 id = req.params.id;
//                 _a.label = 1;
//             case 1:
//                 _a.trys.push([1, 3, , 4]);
//                 return [4 /*yield*/, pool.query('DELETE FROM events WHERE id = $1 AND user_id = $2 RETURNING *', [id, req.user.id])];
//             case 2:
//                 result = _a.sent();
//                 if (result.rows.length === 0) {
//                     return [2 /*return*/, res.status(404).json({ message: 'Event not found or you do not have permission to delete it' })];
//                 }
//                 console.log('Event deleted:', result.rows[0]);
//                 res.json({ message: 'Event deleted successfully' });
//                 return [3 /*break*/, 4];
//             case 3:
//                 error_14 = _a.sent();
//                 console.error('Error deleting event:', error_14);
//                 res.status(500).json({ message: 'Internal server error' });
//                 return [3 /*break*/, 4];
//             case 4: return [2 /*return*/];
//         }
//     });
// }); });
// // Test route
// app.get('/api/test', function (req, res) {
//     res.json({ message: "This is a test route." });
// });
// // Start the server
// app.listen(port, function () {
//     console.log("Server is running on port ".concat(port));
// });
