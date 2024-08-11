"use strict";
'use client';
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
const im_1 = require("react-icons/im");
const ri_1 = require("react-icons/ri");
const fi_1 = require("react-icons/fi");
const link_1 = __importDefault(require("next/link"));
const Hero = () => {
    const [events, setEvents] = (0, react_1.useState)([]);
    const [error, setError] = (0, react_1.useState)(null);
    // Use environment variable for the API URL, fallback to localhost during development
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    (0, react_1.useEffect)(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios_1.default.get(`${apiUrl}/api/events/upcoming`);
                setEvents(response.data);
            }
            catch (error) {
                console.error('Error fetching events:', error);
                setError('An unexpected error occurred');
            }
        };
        fetchEvents();
    }, [apiUrl]);
    const slidingEvents = [...events, ...events];
    return (<section className="text-center py-12 mx-auto container">
      <h1 className="text-7xl font-bold mb-6 space-x-5">
        <span className="text-blue-400 animate-slidein2">Connect</span>
        <span className="text-yellow-300 animate-slidein3">Plan</span>
        <span className="text-green-400 animate-slidein4">Celebrate</span>
      </h1>
      <p className="text-center max-w-5xl mx-auto text-xl mb-12 animate-slidein">
        Your one-stop platform for creating, discovering, and joining events.
        From intimate gatherings to big celebrations, EventConnect makes
        planning and attending social events effortless. Start connecting and
        celebrating today!
      </p>
      <button className="border border-blue-500 rounded-full p-4 px-8 text-white bg-blue-500 font-medium mx-auto flex items-center space-x-2 animate-slidein select-none">
        <link_1.default href="/signup">
          <span className="text-2xl">Get Started</span>
        </link_1.default>
        <im_1.ImEllo className="text-2xl"/>
      </button>
      <div className="my-12"></div>
      <h2 className="text-3xl font-bold mb-8 text-blue-400">Upcoming Events</h2>
      <div className="overflow-hidden mt-8">
        <div className="flex animate-slide">
          {error ? (<p className="text-red-500">{error}</p>) : (slidingEvents.map((event, index) => (<div key={index} className="bg-blue-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer" style={{ minWidth: '300px', height: '350px' }}>
                <div className="relative h-48 bg-blue-200 flex items-center justify-center">
                  <im_1.ImEllo className="text-6xl text-blue-500"/>
                  <div className="absolute top-2 left-2 bg-blue-500 text-white p-2 rounded-full text-sm" style={{ maxWidth: '130px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={event.created_by}>
                    Created by: {event.created_by}
                  </div>
                  <div className="absolute top-2 right-2 bg-blue-500 text-white p-2 rounded-full flex items-center" style={{ maxWidth: '130px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={event.location}>
                    <ri_1.RiMapPinUserLine className="text-xl flex-shrink-0"/>
                    <span style={{ marginLeft: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.location}</span>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                    Starts at: {new Date(event.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-blue-600 text-center" title={event.name.length > 15 ? event.name : ''}>
                    Event: {event.name.length > 15 ? event.name.substring(0, 15) + '...' : event.name}
                    {event.name.length > 15 && (<span className="tooltip">{event.name}</span>)}
                  </h3>
                  <div className="text-gray-600 text-sm truncate-text" title={event.description.length > 50 ? event.description : ''}>
                    Description: {event.description.length > 50 ? event.description.substring(0, 50) + '...' : event.description}
                    {event.description.length > 50 && (<span className="tooltip">{event.description}</span>)}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center space-x-2">
                      <fi_1.FiUsers className="text-green-500 animate-pulse"/>
                      <span className="text-sm text-green-500">
                        {event.attendee_count || 0} Attending
                      </span>
                    </div>
                  </div>
                </div>
              </div>)))}
        </div>
      </div>
    </section>);
};
exports.default = Hero;
//# sourceMappingURL=Hero.jsx.map