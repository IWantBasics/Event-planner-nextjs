"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const axios_1 = __importDefault(require("axios"));
const router_1 = require("next/router");
const im_1 = require("react-icons/im");
const ri_1 = require("react-icons/ri");
const fi_1 = require("react-icons/fi");
const bi_1 = require("react-icons/bi");
const EventDetails = () => {
    const [event, setEvent] = (0, react_1.useState)(null);
    const [user, setUser] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [message, setMessage] = (0, react_1.useState)('');
    const [messages, setMessages] = (0, react_1.useState)([]);
    const router = (0, router_1.useRouter)();
    const { id } = router.query;
    const chatBoxRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        const fetchUser = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                console.log('Stored user retrieved:', parsedUser);
            }
        };
        const fetchData = async () => {
            if (id) {
                await fetchEventDetails();
                await fetchMessages(); // Fetch existing messages
            }
        };
        fetchUser();
        fetchData();
    }, [id]); // Dependency array includes id
    const fetchEventDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }
            const response = await axios_1.default.get(`http://localhost:3000/api/events/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            const event = response.data;
            event.attendees = event.attendees || [];
            setEvent(event);
            console.log('Event details fetched:', event);
        }
        catch (error) {
            console.error('Error fetching event details:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios_1.default.get(`http://localhost:3000/api/events/${id}/messages`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            console.log('Raw messages fetched from server:', response.data);
            const storedUser = localStorage.getItem('user');
            const currentUser = storedUser ? JSON.parse(storedUser) : null;
            const formattedMessages = response.data.map((msg) => {
                console.log('Processing message:', msg);
                let messageUser = 'Unknown User';
                if (currentUser && msg.user_id === currentUser.id) {
                    messageUser = currentUser.fullname;
                }
                else if (msg.sender) {
                    messageUser = msg.sender;
                }
                console.log(`Message user is: ${messageUser}`);
                return {
                    userId: msg.user_id,
                    user: messageUser,
                    text: msg.message,
                    timestamp: msg.timestamp,
                };
            });
            console.log('Formatted messages:', formattedMessages);
            setMessages(formattedMessages);
        }
        catch (error) {
            console.error('Error fetching messages:', error);
        }
    };
    const handleLeaveEvent = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token)
                throw new Error('No token found');
            await axios_1.default.post(`http://localhost:3000/api/events/leave/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            router.push('/dashboard');
        }
        catch (error) {
            console.error('Error leaving event:', error);
        }
    };
    const handleSendMessage = async () => {
        if (!user) {
            console.error('User is not defined');
            return;
        }
        if (message.trim()) {
            const newMessage = {
                userId: user.id,
                user: user.fullname,
                text: message,
                timestamp: new Date().toISOString(),
            };
            try {
                const token = localStorage.getItem('token');
                await axios_1.default.post(`http://localhost:3000/api/events/${id}/messages`, {
                    userId: user.id,
                    message,
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });
                setMessages((prev) => [...prev, newMessage]);
                setMessage('');
                if (chatBoxRef.current) {
                    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
                }
            }
            catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
            event.preventDefault();
        }
    };
    if (loading || !event)
        return <div>Loading...</div>;
    return (<div className="container mx-auto mt-10 p-5">
      <button onClick={() => router.back()} className="bg-red-500 text-white py-2 px-4 rounded mb-6 shadow-md hover:bg-red-600 transition duration-200">
        Back
      </button>
      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8">
        <div className="w-full md:w-1/2 bg-blue-100 rounded-xl overflow-hidden shadow-md p-6">
          <div className="relative h-48 bg-blue-200 flex items-center justify-center rounded-xl">
            <im_1.ImEllo className="text-6xl text-blue-500"/>
            <div className="absolute top-2 left-2 bg-blue-500 text-white p-2 rounded-full text-sm">
              Created by: {event.created_by}
            </div>
            <div className="absolute top-2 right-2 bg-blue-500 text-white p-2 rounded-full flex items-center space-x-1">
              <ri_1.RiMapPinUserLine className="text-xl"/>
              <span className="text-sm">{event.location}</span>
            </div>
            <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
              Starts at: {new Date(event.date).toLocaleDateString()}
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-blue-600">Event: {event.name}</h3>
          <p className="text-gray-600 text-sm mb-4" style={{ whiteSpace: 'pre-wrap' }}>Description: {event.description}</p>
          <div className="bg-white rounded-xl p-6">
            <h4 className="text-xl font-semibold mb-4 text-blue-600">Attending</h4>
            <ul className="space-y-2">
              {event.attendees.map((attendee) => (<li key={attendee.id} className="flex items-center space-x-2">
                  <span className="bg-blue-500 w-4 h-4 rounded-full inline-block"></span>
                  <span className="text-lg text-gray-800">{attendee.name}</span>
                </li>))}
            </ul>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col space-y-6">
          <div className="relative bg-blue-100 rounded-xl overflow-hidden shadow-md p-6 flex-grow">
            <h4 className="text-xl font-semibold mb-4 text-blue-600">Chat Section</h4>
            <div className="absolute top-2 right-2">
              <button onClick={handleLeaveEvent} className="text-white bg-red-500 p-2 rounded-full shadow-md hover:bg-red-600 transition duration-200">
                <bi_1.BiDoorOpen className="text-2xl"/>
              </button>
            </div>
            <div ref={chatBoxRef} className="overflow-y-auto bg-gray-50 p-3 rounded-lg border border-gray-200 h-96">
              {messages.map((msg, index) => (<div key={index} className="flex items-start space-x-3 mb-2">
                  <im_1.ImEllo className="text-3xl text-blue-500"/>
                  <div>
                    <span className="font-semibold text-blue-600">{msg.user}</span>
                    <div className="bg-blue-100 p-2 rounded-lg">
                      {msg.text}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>))}
            </div>
            <div className="relative mt-4">
              <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type a message..." className="p-3 pl-10 border border-gray-300 rounded-full w-full shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              <button onClick={handleSendMessage} className="absolute right-2 top-2 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition duration-200">
                <fi_1.FiSend className="text-xl"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
exports.default = EventDetails;
//# sourceMappingURL=%5Bid%5D.jsx.map