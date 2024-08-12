import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ImEllo } from "react-icons/im";
import axios from 'axios';

const DashboardNavbar: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    console.log('Logout button clicked');
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {}, {
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
    <nav className="w-full px-4 sm:px-8 md:px-16 flex items-center justify-center">
      <div className="flex w-full max-w-5xl justify-between items-center">
        <Link href="/dashboard">
          <img 
            src="/logopin.png" 
            className="h-12 sm:h-16 md:h-20 cursor-pointer" 
            alt="EventConnect logo" 
            title="Return to Dashboard"
          />
        </Link>
        <ul className="flex items-center space-x-4 sm:space-x-10 md:space-x-20">
          <li 
            onClick={handleLogout}
            className="cursor-pointer font-medium text-white border border-red-500 px-3 py-2 sm:px-4 md:px-5 bg-red-500 rounded-full flex items-center space-x-2 select-none"
          >
            <span>Logout</span>
            <ImEllo className="text-xl sm:text-2xl" />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
