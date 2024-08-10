import React from 'react';
import Link from 'next/link';
import { Event } from '../../../src/interfaces';
import { ImEllo } from 'react-icons/im';
import { RiMapPinUserLine } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";
import { useRouter } from 'next/router';

interface EventListProps {
  events: Event[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onJoin: (id: number) => void;
  isOwnEventList: boolean;
  className?: string;
}

const EventList: React.FC<EventListProps> = ({ events, onDelete, onEdit, onJoin, isOwnEventList, className }) => {
  const router = useRouter();

  const handleCardClick = (id: number) => {
    console.log(`Navigating to event details page for event ID: ${id}`);
    router.push(`/event-details/${id}`);
  };

  return (
    <div className={`container mx-auto mt-10 p-5 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-20">  
        {events.map(event => (
          <div 
            key={event.id} 
            className="bg-blue-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            onClick={() => handleCardClick(event.id)}
            style={{ width: '300px', height: '350px', margin: '0 auto' }}  
          >
            <div className="relative h-48 bg-blue-200 flex items-center justify-center">
              <ImEllo className="text-6xl text-blue-500" />
              <div 
                className="absolute top-2 left-2 bg-blue-500 text-white p-2 rounded-full text-sm"
                style={{ maxWidth: '130px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                title={event.created_by}
              >
                Created by: {event.created_by}
              </div>
              <div 
                className="absolute top-2 right-2 bg-blue-500 text-white p-2 rounded-full flex items-center"
                style={{ maxWidth: '130px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                title={event.location}
              >
                <RiMapPinUserLine className="text-xl flex-shrink-0" />
                <span style={{ marginLeft: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.location}</span>
              </div>
              <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                Starts at: {new Date(event.date).toLocaleDateString()}
              </div>
            </div>
            <div className="p-6">
              <h3 
                className="text-xl font-semibold mb-2 text-blue-600 text-center"
                title={event.name.length > 15 ? event.name : ""}
              >
                Event: {event.name.length > 15 ? event.name.substring(0, 15) + "..." : event.name}
                {event.name.length > 15 && (
                  <span className="tooltip">{event.name}</span>
                )}
              </h3>
              <div 
                className="text-gray-600 text-sm truncate-text"
                title={event.description.length > 50 ? event.description : ""}
              >
                Description: {event.description.length > 50 ? event.description.substring(0, 50) + "..." : event.description}
                {event.description.length > 50 && (
                  <span className="tooltip">{event.description}</span>
                )}
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center space-x-2">
                  <FiUsers className="text-green-500 animate-pulse" />
                  <span className="text-sm text-green-500">
                    {event.attendee_count || 0} Attending
                  </span>
                </div>
                <div className="flex space-x-2">
                  {isOwnEventList ? (
                    <>
                      <Link href={`/edit-event/${event.id}`}>
                        <button 
                          className="bg-yellow-400 text-white py-1 px-2 rounded-md hover:bg-yellow-500 transition duration-300" 
                          onClick={(e) => e.stopPropagation()}
                        >
                          Edit
                        </button>
                      </Link>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(event.id); }} 
                        className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600 transition duration-300" 
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation();
                        onJoin(event.id);
                      }} 
                      className="bg-green-500 text-white py-1 px-2 rounded-md hover:bg-green-600 transition duration-300"
                    >
                      Join
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
