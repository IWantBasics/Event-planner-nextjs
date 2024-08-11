"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const link_1 = __importDefault(require("next/link"));
const im_1 = require("react-icons/im");
const ri_1 = require("react-icons/ri");
const fi_1 = require("react-icons/fi");
const router_1 = require("next/router");
const EventList = ({ events, onDelete, onEdit, onJoin, isOwnEventList, className }) => {
    const router = (0, router_1.useRouter)();
    const handleCardClick = (id) => {
        console.log(`Navigating to event details page for event ID: ${id}`);
        router.push(`/event-details/${id}`);
    };
    return (<div className={`container mx-auto mt-10 p-5 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-20">  
        {events.map(event => (<div key={event.id} className="bg-blue-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer" onClick={() => handleCardClick(event.id)} style={{ width: '300px', height: '350px', margin: '0 auto' }}>
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
              <h3 className="text-xl font-semibold mb-2 text-blue-600 text-center" title={event.name.length > 15 ? event.name : ""}>
                Event: {event.name.length > 15 ? event.name.substring(0, 15) + "..." : event.name}
                {event.name.length > 15 && (<span className="tooltip">{event.name}</span>)}
              </h3>
              <div className="text-gray-600 text-sm truncate-text" title={event.description.length > 50 ? event.description : ""}>
                Description: {event.description.length > 50 ? event.description.substring(0, 50) + "..." : event.description}
                {event.description.length > 50 && (<span className="tooltip">{event.description}</span>)}
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center space-x-2">
                  <fi_1.FiUsers className="text-green-500 animate-pulse"/>
                  <span className="text-sm text-green-500">
                    {event.attendee_count || 0} Attending
                  </span>
                </div>
                <div className="flex space-x-2">
                  {isOwnEventList ? (<>
                      <link_1.default href={`/edit-event/${event.id}`}>
                        <button className="bg-yellow-400 text-white py-1 px-2 rounded-md hover:bg-yellow-500 transition duration-300" onClick={(e) => e.stopPropagation()}>
                          Edit
                        </button>
                      </link_1.default>
                      <button onClick={(e) => { e.stopPropagation(); onDelete(event.id); }} className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600 transition duration-300">
                        Delete
                      </button>
                    </>) : (<button onClick={(e) => {
                    e.stopPropagation();
                    onJoin(event.id);
                }} className="bg-green-500 text-white py-1 px-2 rounded-md hover:bg-green-600 transition duration-300">
                      Join
                    </button>)}
                </div>
              </div>
            </div>
          </div>))}
      </div>
    </div>);
};
exports.default = EventList;
//# sourceMappingURL=EventList.jsx.map