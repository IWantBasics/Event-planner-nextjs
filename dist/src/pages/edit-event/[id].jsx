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
const router_1 = require("next/router");
const axios_1 = __importDefault(require("axios"));
const DashboardNavbar_1 = __importDefault(require("../../app/Components/DashboardNavbar"));
const im_1 = require("react-icons/im");
const EditEvent = () => {
    const [eventData, setEventData] = (0, react_1.useState)({
        name: '',
        date: '',
        description: '',
        location: '',
    });
    const router = (0, router_1.useRouter)();
    const { id } = router.query;
    (0, react_1.useEffect)(() => {
        const fetchEvent = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios_1.default.get(`http://localhost:3000/api/events/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEventData(response.data);
            }
            catch (error) {
                console.error('Error fetching event:', error);
            }
        };
        if (id) {
            fetchEvent();
        }
    }, [id]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData(prevState => ({ ...prevState, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios_1.default.put(`http://localhost:3000/api/events/${id}`, eventData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            router.push('/dashboard');
        }
        catch (error) {
            console.error('Error updating event:', error);
        }
    };
    return (<>
      <DashboardNavbar_1.default />
      <div className="container mx-auto mt-10 p-5">
        <h1 className="text-4xl font-bold mb-6 text-center text-yellow-300">Edit Event</h1>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-4">
            <label htmlFor="name" className="block text-blue-500 font-semibold mb-2">Event Name</label>
            <input id="name" name="name" value={eventData.name} onChange={handleChange} placeholder="Event Name" className="w-full p-2 border rounded"/>
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="block text-blue-500 font-semibold mb-2">Event Date</label>
            <input id="date" name="date" type="date" value={eventData.date ? eventData.date.split('T')[0] : ''} onChange={handleChange} className="w-full p-2 border rounded"/>
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-blue-500 font-semibold mb-2">Event Description</label>
            <textarea id="description" name="description" value={eventData.description} onChange={handleChange} placeholder="Event Description" className="w-full p-2 border rounded"></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block text-blue-500 font-semibold mb-2">Event Location</label>
            <input id="location" name="location" value={eventData.location} onChange={handleChange} placeholder="Event Location" className="w-full p-2 border rounded"/>
          </div>
          <button type="submit" className="w-full bg-yellow-300 text-white py-2 px-4 rounded-md hover:bg-yellow-400 transition duration-300 flex justify-center items-center space-x-2">
            <im_1.ImEllo className="text-xl"/>
            <span>Update Event</span>
          </button>
        </form>
      </div>
    </>);
};
exports.default = EditEvent;
//# sourceMappingURL=%5Bid%5D.jsx.map