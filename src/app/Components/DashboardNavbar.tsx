import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { RiMapPinUserLine } from "react-icons/ri";
import { ImEllo } from "react-icons/im";
import axios from 'axios';

const DashboardNavbar: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    console.log('Logout button clicked');
    try {
      const response = await axios.post('http://localhost:3000/api/auth/logout', {}, {
        withCredentials: true
      });
      console.log('Logout response:', response);
      if (response.status === 200) {
        localStorage.removeItem('token');
        console.log('Token removed from localStorage');
        router.push('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav className="px-60 flex items-center justify-between">
      <Link href="/dashboard">
        <img src="/logopin.png" className="h-20 w-50 cursor-pointer" alt="EventConnect logo" title="Return to Dashboard"/>
      </Link>
      <ul className="flex justify-space space-x-14 pr-6">
        <li 
          onClick={handleLogout}
          className="cursor-pointer font-medium text-white border border-red-500 px-5 py-2 bg-red-500 rounded-full flex items-center space-x-2 select-none"
        >
          <span>Logout</span>
          <ImEllo className="text-2xl" />
        </li>
      </ul>
    </nav>
  );
};

export default DashboardNavbar;