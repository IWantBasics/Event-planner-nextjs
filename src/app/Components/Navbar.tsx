import React from 'react'
import { ImEllo } from "react-icons/im";
import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-4 md:px-10 lg:px-20 xl:px-60 py-4">
      <div className="flex-shrink-0">
        <img src="/logopin.png" className="h-10 md:h-12 lg:h-16 cursor-pointer" alt="logo" />
      </div>
      <ul className="flex space-x-4 md:space-x-8 lg:space-x-14">
        <Link href="/login">
          <li className="cursor-pointer font-semibold px-4 md:px-5 py-2 flex items-center space-x-2 border border-black border-2 rounded-full select-none">
            <span>Login</span>
            <ImEllo className="text-xl"/>
          </li>
        </Link>
        <Link href="/signup">
          <li className="cursor-pointer font-medium text-white border border-blue-500 px-4 md:px-5 py-2 bg-blue-500 rounded-full flex items-center space-x-2 select-none">
            <span>Sign up</span>
            <ImEllo className="text-xl" />
          </li>
        </Link>
      </ul>
    </nav>
  )
}

export default Navbar
