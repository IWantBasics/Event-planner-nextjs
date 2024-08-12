import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ImEllo } from 'react-icons/im';
import { toast } from 'react-toastify';
import DashboardNavbar from '../app/Components/DashboardNavbar';
import EventList from '../app/Components/EventList';
import { Event } from './../../src/interfaces';
import Loading from '@/app/Components/Loading';

interface User {
  id: number;
  fullname: string;
  email: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [otherEvents, setOtherEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const userResponse = await axios.get('http://localhost:3000/api/user', {
        headers: { 'Authorization': `Bearer ${token}` },
        withCredentials: true,
      });
      setUser(userResponse.data);
      localStorage.setItem('user', JSON.stringify(userResponse.data));

      const myEventsResponse = await axios.get('http://localhost:3000/api/events', {
        headers: { 'Authorization': `Bearer ${token}` },
        withCredentials: true,
      });
      setMyEvents(myEventsResponse.data);

      const otherEventsResponse = await axios.get('http://localhost:3000/api/events/others', {
        headers: { 'Authorization': `Bearer ${token}` },
        withCredentials: true,
      });
      setOtherEvents(otherEventsResponse.data);
    } catch (error) {
      console.error("Error in fetchData:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    router.push('/create-event');
  };

  const handleDeleteEvent = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        await axios.delete(`http://localhost:3000/api/events/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
          withCredentials: true,
        });
        setMyEvents(myEvents.filter(event => event.id !== id));
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleEditEvent = (id: number) => {
    router.push(`/edit-event/${id}`);
  };

  const handleJoinEvent = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const response = await axios.post(`http://localhost:3000/api/events/join/${id}`, {}, {
        headers: { 'Authorization': `Bearer ${token}` },
        withCredentials: true,
      });
      toast.success("Successfully joined the event!");

      setOtherEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === id 
            ? { ...event, attendee_count: (Number(event.attendee_count) || 0) + 1 } 
            : event
        )
      );

    } catch (error) {
      console.error('Error joining event:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'An unknown error occurred';
        toast.error(`Failed to join event: ${errorMessage}`);
      } else {
        toast.error("Failed to join event. Please try again later.");
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <DashboardNavbar />
      <div className="text-center py-12 mx-auto container">
        <h1 className="text-5xl font-bold mb-6">
          <span className="text-blue-400 animate-slidein2">Welcome back,</span>{' '}
          <span className="text-yellow-300 animate-slidein3">{user?.fullname || 'Guest'}</span>
          <span className="text-green-400 animate-slidein4">!</span>
        </h1>

        <button
          onClick={handleCreateEvent}
          className="bg-blue-500 text-white rounded-full py-3 px-6 font-medium mx-auto flex items-center space-x-2 animate-slidein hover:bg-blue-600 transition duration-300 mb-12"
        >
          <span className="text-xl">Create New Event</span>
          <ImEllo className="text-xl" />
        </button>

        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-blue-400">Upcoming Events</h2>
          <div className="overflow-x-auto">
            <div className="flex space-x-4 whitespace-nowrap">
              {otherEvents.map((event, index) => (
                <div key={index} className="inline-block" style={{ flexShrink: 0, width: '300px' }}>
                  <EventList 
                    events={[event]} 
                    onDelete={handleDeleteEvent} 
                    onEdit={handleEditEvent}
                    onJoin={handleJoinEvent}
                    isOwnEventList={false} 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-green-400">My Events</h2>
          <div className="overflow-x-auto">
            <div className="flex space-x-4 whitespace-nowrap">
              {myEvents.map((event, index) => (
                <div key={index} className="inline-block" style={{ flexShrink: 0, width: '300px' }}>
                  <EventList 
                    events={[event]} 
                    onDelete={handleDeleteEvent} 
                    onEdit={handleEditEvent}
                    onJoin={handleJoinEvent}
                    isOwnEventList={true}  
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;