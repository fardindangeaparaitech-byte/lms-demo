import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import BeautifulSearchBar from './BeautifulSearchBar';

const Navbar = () => {
  const [showCoursesDropdown, setShowCoursesDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const location = useLocation();
  const { backendUrl, navigate, userType } = useContext(AppContext);
  const { openSignIn } = useClerk();
  const { user } = useUser();

  const navigationLinks = [
    { name: 'Resources', path: '/resources' },
    { name: 'Success Stories', path: '/success-stories' }
  ];

  const courseCategories = [
    "Web Development's Projects",
    'Data Science & AI Projects',
    'Mobile Development Projects', 
    'UI/UX Design Projects',
    'Digital Marketing Projects',
    'Business & Finance Projects',
    'Photography & Video Projects',
    'Music & Creative Arts Projects'
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-8">
            <img 
              onClick={() => navigate('/')} 
              src="/Aparaitech_logo.png" 
              alt="Logo" 
              className="w-20 lg:w-24 cursor-pointer transform translate-y-[15px]" 
            />

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center h-16 space-x-0">
              {/* All Courses Dropdown */}
              <div className="relative h-16 flex items-center">
                <button
                  onMouseEnter={() => setShowCoursesDropdown(true)}
                  className="flex items-center space-x-2 px-4 py-2 border border-[#6D28D9] text-[#6D28D9] font-medium rounded-lg h-10 hover:bg-[#F3E8FF]"
                >
                  <span>All Projects</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showCoursesDropdown && (
                  <div 
                    className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50"
                    onMouseEnter={() => setShowCoursesDropdown(true)}
                    onMouseLeave={() => setShowCoursesDropdown(false)}
                  >
                    <div className="px-3 py-2 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-800 text-sm">Project Categories</h3>
                    </div>
                    <div className="grid grid-cols-1">
                      {courseCategories.map((category, index) => (
                        <button
                          key={index}
                          className="w-full text-left px-3 py-2 text-gray-700 text-sm hover:bg-[#F3E8FF] hover:text-[#6D28D9] border-b border-gray-100 last:border-b-0"
                          onClick={() => {
                            setShowCoursesDropdown(false);
                          }}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Main Navigation Links */}
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="flex items-center h-16 px-4 text-gray-800 font-medium text-sm hover:bg-[#F3E8FF]"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-6">
            
            {/* Beautiful Search Bar */}
            <div className="hidden lg:block">
              <BeautifulSearchBar />
            </div>

            {/* ✅ EDUCATOR DASHBOARD - Search Bar ke baad */}
            {userType === 'admin' && (
              <button
                onClick={() => navigate('/educator')}
                className="hidden lg:flex items-center h-16 px-4 text-gray-800 font-medium text-sm hover:bg-[#F3E8FF]"
              >
                Educator Dashboard
              </button>
            )}

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Student ke liye My Projects */}
                {userType === 'student' && (
                  <Link 
                    to="/my-enrollments"
                    className="hidden md:flex items-center h-16 px-4 text-gray-800 font-medium text-sm hover:bg-[#F3E8FF]"
                  >
                    <span>My Projects</span>
                  </Link>
                )}

                <div className="border-l border-gray-300 h-6"></div>
                <div className="flex items-center h-16 px-3 hover:bg-[#F3E8FF]">
                  <UserButton />
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => openSignIn()}
                  className="flex items-center h-16 px-4 text-gray-800 font-medium text-sm hover:bg-[#F3E8FF]"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openSignIn()}
                  className="bg-[#6D28D9] text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-[#5B21B6]"
                >
                  Login/Register
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden flex items-center h-16 px-3 text-gray-800 hover:bg-[#F3E8FF]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-gray-200 py-4 bg-white">
            <div className="space-y-1">
              {/* All Courses in Mobile */}
              <div className="px-3 py-1">
                <button className="w-full flex items-center justify-between px-3 py-1 border border-[#6D28D9] text-[#6D28D9] font-medium rounded-md text-sm hover:bg-[#F3E8FF]">
                  <span>All Courses</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block px-3 py-2 text-gray-800 font-medium text-sm hover:bg-[#F3E8FF]"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Admin ke liye Mobile Menu me */}
              {userType === 'admin' && (
                <button
                  onClick={() => { navigate('/educator'); setShowMobileMenu(false); }}
                  className="block w-full text-left px-3 py-2 text-gray-800 font-medium text-sm hover:bg-[#F3E8FF]"
                >
                  Educator Dashboard
                </button>
              )}
              
              {/* Student ke liye Mobile Menu me */}
              {user && userType === 'student' && (
                <Link
                  to="/my-enrollments"
                  className="block px-3 py-2 text-gray-800 font-medium text-sm hover:bg-[#F3E8FF]"
                  onClick={() => setShowMobileMenu(false)}
                >
                  My Projects
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;