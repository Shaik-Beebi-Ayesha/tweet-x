import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleNavLinkClick = (path) => {
    setActiveLink(path);
  };

  return (
    <div className='flex justify-around p-3 shadow-md items-center'>
      <Link to='/profile'><h3 className='text-rose-400 font-semibold text-2xl'>TweetX</h3></Link>
      <ul className='flex gap-[20px] md:gap-[40px] items-center'>
        <li>
          <Link
            to='/feed'
            className={`text-gray-400 font-semibold hover:text-rose-400 ${
              activeLink === '/feed' ? 'text-rose-400' : ''
            }`}
            onClick={() => handleNavLinkClick('/feed')}
          >
            Feed
          </Link>
        </li>
        <li>
          <Link
            to='/users'
            className={`text-gray-400 font-semibold hover:text-rose-400 ${
              activeLink === '/users' ? 'text-rose-400' : ''
            }`}
            onClick={() => handleNavLinkClick('/users')}
          >
            Users
          </Link>
        </li>
        <li>
          <Link
            to='/profile'
            className={`text-gray-400 font-semibold hover:text-rose-400 ${
              activeLink === '/profile' ? 'text-rose-400' : ''
            }`}
            onClick={() => handleNavLinkClick('/profile')}
          >
            Profile
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
