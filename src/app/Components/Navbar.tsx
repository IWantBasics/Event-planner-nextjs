'use client';
import React, { useState } from 'react';
import { ImEllo } from 'react-icons/im';
import { FaBars, FaTimes } from 'react-icons/fa';
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="flex items-center justify-between px-4 lg:px-20 xl:px-60">
      <div className="flex-shrink-0">
        <img
          src="/logopin.png"
          className="h-10 md:h-12 lg:h-16 xl:h-20 cursor-pointer"
          alt="logo"
        />
      </div>
      <div className="md:hidden">
        <button onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
        </button>
      </div>
      <ul
        className={`fixed inset-0 bg-white z-50 p-10 h-1/4 transition-transform transform ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        } md:static md:flex md:bg-transparent md:translate-y-0 md:space-x-8 md:items-center`}
      >
        <button onClick={toggleMenu} className="md:hidden absolute top-4 right-4">
          <FaTimes className="text-3xl" />
        </button>
        <li className="flex justify-center items-center mb-6 md:mb-0">
          <Link href="/login">
            <div className="cursor-pointer font-semibold px-4 py-2 border border-black border-2 rounded-full flex items-center space-x-2">
              <span>Login</span>
              <ImEllo className="text-xl" />
            </div>
          </Link>
        </li>
        <li className="flex justify-center items-center">
          <Link href="/signup">
            <div className="cursor-pointer font-medium text-white px-4 py-2 bg-blue-500 rounded-full flex items-center space-x-2">
              <span>Sign up</span>
              <ImEllo className="text-xl" />
            </div>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
