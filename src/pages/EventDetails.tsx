import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Loading from '../app/Components/Loading';
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
      console.log('Fetched event details:', response.data); // Debugging log
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading/>;
  if (!event) return <div>No event found</div>;

  return (
    <div className="container mx-auto mt-10 p-5">
      <button
        onClick={() => router.back()}
        className="bg-red-500 text-white py-2 px-4 rounded mb-4"
      >
        Back
      </button>
      <div className="bg-white rounded-xl shadow-md p-6 mb-4">
        <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
        <p className="text-lg mb-4">Created by: {event.created_by}</p>
        <p className="text-lg mb-4">Location: {event.location}</p>
        <p className="text-lg mb-4">Date: {new Date(event.date).toLocaleDateString()}</p>
        <p className="text-lg mb-4">Description: {event.description}</p>
        <h2 className="text-2xl font-semibold mb-4">Attendees</h2>
        <ul>
          {event.attendees.map((attendee) => (
            <li key={attendee.id} className="mb-2">
              {attendee.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventDetailsPage;
