'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ImEllo } from 'react-icons/im';
import { RiMapPinUserLine } from 'react-icons/ri';
import { FiUsers } from 'react-icons/fi';
import Link from 'next/link';

interface Event {
  id: number;
  name: string;
  date: string;
  description: string;
  location: string;
  attendee_count: number;
  created_by: string;
}

const Hero: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedDiv, setSelectedDiv] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/events/upcoming`);
        setEvents(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(`Error: ${error.response?.data?.message || error.message}`);
        } else {
          setError('An unexpected error occurred');
        }
      }
    };

    fetchEvents();
  }, [apiUrl]);

  const handleTooltipToggle = (divName: string | null) => {
    setSelectedDiv((prevSelected) => (prevSelected === divName ? null : divName));
  };

  const truncateText = (text: string, maxLength: number, isLargeScreen: boolean) => {
   return isLargeScreen ? text : text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  };

  return (
    <section className="text-center py-8 md:py-12 lg:py-9 mx-auto container px-4 md:px-8 lg:px-20 xl:px-32">
      <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
        <span className="text-blue-400 block md:inline animate-slidein2 md:mr-2 lg:mr-4">Connect</span>
        <span className="text-yellow-300 block md:inline animate-slidein3 md:mr-2 lg:mr-4">Plan</span>
        <span className="text-green-400 block md:inline animate-slidein4">Celebrate</span>
      </h1>
      <p className="text-center max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto text-base md:text-lg lg:text-xl mb-8 md:mb-12 animate-slidein">
        Your one-stop platform for creating, discovering, and joining events.
        From intimate gatherings to big celebrations, EventConnect makes
        planning and attending social events effortless. Start connecting and
        celebrating today!
      </p>
      <div className="flex justify-center">
        <Link href="/signup">
          <button className="border border-blue-500 rounded-full p-3 md:p-4 px-6 md:px-8 text-white bg-blue-500 font-medium flex items-center space-x-2 animate-slidein select-none">
            <span className="text-lg md:text-2xl">Get Started</span>
            <ImEllo className="text-xl md:text-2xl" />
          </button>
        </Link>
      </div>
      <div className="my-8 md:my-12 lg:my-16"></div>
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 lg:mb-12 text-blue-400">Upcoming Events</h2>
      <div className="overflow-hidden mt-4 md:mt-8 relative">
        <div className="flex animate-slide whitespace-nowrap">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            events.map((event, index) => (
              <div
                key={index}
                className="bg-blue-100 rounded-xl shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer relative z-20 mx-2 lg:mx-4"
                style={{ minWidth: '300px', height: '350px', maxWidth: '300px' }}
              >
                <div className="relative bg-blue-200 rounded-xl p-4 flex flex-col justify-between" style={{ minHeight: '200px' }}>
                  <div>
                    <div className="flex justify-between items-center space-x-2 mb-4">
                      <div
                        className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm flex items-center justify-center max-h-10 w-auto max-w-[50%] relative group"
                        onClick={() => handleTooltipToggle(`created_by-${index}`)}
                      >
                        <span className="truncate">
                          {truncateText(event.created_by, 15, false)}
                        </span>
                        {selectedDiv === `created_by-${index}` && (
                          <div className="absolute bg-blue-500 text-white px-2 py-1 rounded-full text-sm top-full left-1/2 transform -translate-x-1/2 mt-1 z-50">
                            Created by: {event.created_by}
                          </div>
                        )}
                      </div>
                      <div
                        className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm flex items-center justify-center max-h-10 w-auto max-w-[50%] relative group"
                        onClick={() => handleTooltipToggle(`location-${index}`)}
                      >
                        <RiMapPinUserLine className="text-xl mr-1" />
                        <span className="truncate">
                          {truncateText(event.location, 15, false)}
                        </span>
                        {selectedDiv === `location-${index}` && (
                          <div className="absolute bg-blue-500 text-white px-2 py-1 rounded-full text-sm top-full left-1/2 transform -translate-x-1/2 mt-1 z-50">
                            Location: {event.location}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-center mt-2">
                      <ImEllo className="text-6xl text-blue-500" />
                    </div>
                  </div>
                  <div
  className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm self-start relative max-h-10 lg:w-auto lg:whitespace-nowrap cursor-pointer mt-4"
  onClick={() => handleTooltipToggle(`starts_at-${index}`)}
>
  <span className="block truncate lg:inline lg:whitespace-nowrap">
    Starts at: {truncateText(formatDate(event.date), 50, false)}
  </span>
  {selectedDiv === `starts_at-${index}` && (
    <div className="absolute bg-blue-500 text-white px-2 py-2 rounded-full text-sm left-1/2 transform -translate-x-1/2 z-50" style={{ top: '120%' }}>
      {formatDate(event.date)}
    </div>
  )}
</div>


                </div>
                <div className="p-6">
                  <h3
                    className="text-xl font-semibold mb-2 text-blue-600 text-center relative cursor-pointer"
                    onClick={() => handleTooltipToggle(`name-${index}`)}
                  >
                    {truncateText(event.name, 15, false)}
                    {selectedDiv === `name-${index}` && (
                      <div className="absolute bg-blue-500 text-white px-2 py-1 rounded-full text-sm top-full left-1/2 transform -translate-x-1/2 mt-1 z-50">
                        {event.name}
                      </div>
                    )}
                  </h3>
                  <div className="relative">
                    <div
                      className="text-gray-600 text-sm truncate-text cursor-pointer"
                      onClick={() => handleTooltipToggle(`description-${index}`)}
                    >
                      {truncateText(event.description, 50, false)}
                    </div>
                    {selectedDiv === `description-${index}` && (
                      <div className="absolute bg-blue-500 text-white px-3 py-2 rounded-lg text-sm top-full left-1/2 transform -translate-x-1/2 mt-1 z-50 w-64 max-w-sm whitespace-normal">
                        {event.description}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center space-x-2">
                      <FiUsers className="text-green-500 animate-pulse" />
                      <span className="text-sm text-green-500">
                        {event.attendee_count || 0} Attending
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
