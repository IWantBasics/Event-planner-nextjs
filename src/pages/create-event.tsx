import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ImEllo } from 'react-icons/im'; 
import DashboardNavbar from '../app/Components/DashboardNavbar';

const CreateEvent: React.FC = () => {
  const [eventData, setEventData] = useState({
    name: '',
    date: '',
    description: '',
    location: '',  
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); 
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/events`, eventData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <>
      <DashboardNavbar />
      <div className="container mx-auto mt-10 p-5">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-500">Create New Event</h1>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 relative">
            <div className="absolute top-2 right-2 bg-blue-100 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <input
              name="name"
              placeholder="Event Name"
              value={eventData.name}
              onChange={handleChange}
              required
              className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="date"
              type="date"
              value={eventData.date}
              onChange={handleChange}
              required
              className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="description"
              placeholder="Event Description"
              value={eventData.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <input
              name="location"
              placeholder="Event Location"
              value={eventData.location}
              onChange={handleChange}
              required
              className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center"
          >
            <ImEllo className="mr-2 text-white" /> 
            Create Event
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateEvent;
