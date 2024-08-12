import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Loading from '../app/Components/Loading';
import { RiMapPinUserLine } from "react-icons/ri";

interface EventDetailsProps {
  id: number;
  name: string;
  date: string;
  description: string;
  location: string;
  created_by: string;
  attendees: { id: number; name: string }[];
}

const EventDetailsPage: React.FC = () => {
  const [event, setEvent] = useState<EventDetailsProps | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`/api/events/${id}`);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!event) return <div>No event found</div>;

  return (
    <div className="container mx-auto mt-10 p-4 sm:p-6 lg:p-8">
      <button
        onClick={() => router.back()}
        className="bg-red-500 text-white py-2 px-4 rounded mb-6"
      >
        Back
      </button>
      <div className="bg-white rounded-xl shadow-md p-6 md:p-8 lg:p-10 mb-4">
        <div className="relative h-48 bg-blue-200 flex items-center justify-center rounded-xl">
          <div className="absolute top-2 left-2 bg-blue-500 text-white p-2 rounded-full text-sm flex items-center max-w-[40%]" title={event.created_by}>
            <span className="truncate">Created by: {event.created_by}</span>
          </div>
          <div className="absolute top-2 right-2 bg-blue-500 text-white p-2 rounded-full text-sm flex items-center max-w-[40%]" title={event.location}>
            <RiMapPinUserLine className="text-xl flex-shrink-0 mr-1" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-center whitespace-normal break-words leading-tight">
  Event: {event.name}
</h1>
        <div className="text-left md:text-center lg:text-left">
          <p className="text-base sm:text-lg lg:text-xl mb-4">
            Date: <span className="font-medium">{new Date(event.date).toLocaleDateString()}</span>
          </p>
          <p className="text-base sm:text-lg lg:text-xl mb-6 break-words">
            Description: {event.description}
          </p>
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-6">Attendees</h2>
        <ul className="list-disc list-inside">
          {event.attendees.map((attendee) => (
            <li key={attendee.id} className="text-base sm:text-lg lg:text-xl mb-2 break-words">
              {attendee.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventDetailsPage;