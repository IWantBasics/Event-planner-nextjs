import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import DashboardNavbar from '../../app/Components/DashboardNavbar';
import { ImEllo } from 'react-icons/im';

const EditEvent: React.FC = () => {
  const [eventData, setEventData] = useState({
    name: '',
    date: '',
    description: '',
    location: '',
  });
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEventData(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/api/events/${id}`, eventData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  return (
    <>
      <DashboardNavbar />
      <div className="container mx-auto mt-10 p-5">
        <h1 className="text-4xl font-bold mb-6 text-center text-yellow-300">Edit Event</h1>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-4">
            <label htmlFor="name" className="block text-blue-500 font-semibold mb-2">Event Name</label>
            <input
              id="name"
              name="name"
              value={eventData.name}
              onChange={handleChange}
              placeholder="Event Name"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="block text-blue-500 font-semibold mb-2">Event Date</label>
            <input
              id="date"
              name="date"
              type="date"
              value={eventData.date ? eventData.date.split('T')[0] : ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-blue-500 font-semibold mb-2">Event Description</label>
            <textarea
              id="description"
              name="description"
              value={eventData.description}
              onChange={handleChange}
              placeholder="Event Description"
              className="w-full p-2 border rounded"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block text-blue-500 font-semibold mb-2">Event Location</label>
            <input
              id="location"
              name="location"
              value={eventData.location}
              onChange={handleChange}
              placeholder="Event Location"
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-300 text-white py-2 px-4 rounded-md hover:bg-yellow-400 transition duration-300 flex justify-center items-center space-x-2"
          >
            <ImEllo className="text-xl" />
            <span>Update Event</span>
          </button>
        </form>
      </div>
    </>
  );
};

export default EditEvent;
