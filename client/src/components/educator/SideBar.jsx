import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom'; // ✅ useLocation add kiya
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

const SideBar = () => {

  const { userType } = useContext(AppContext) // ✅ userType use karo
  const location = useLocation(); // ✅ useLocation use karo

  const menuItems = [
    { name: 'Dashboard', path: '/educator', icon: assets.home_icon },
    { name: 'Add Project', path: '/educator/add-course', icon: assets.add_icon },
    { name: "My Project's", path: '/educator/my-courses', icon: assets.my_course_icon },
    { name: 'Student Enrolled', path: '/educator/student-enrolled', icon: assets.person_tick_icon },
  ];

  // ✅ SIRF ADMIN/USERTYPE CHECK KARO, isEducator nahi
  return userType === 'admin' && (
    <div className='md:w-72 w-20 min-h-screen bg-purple-50 shadow-2xl py-6 flex flex-col border-r border-purple-400'>
      {/* Logo/Brand Area - Bright Font */}
      <div className='px-6 mb-8 md:block hidden'>
        <div className='bg-gradient-to-r from-purple-500/70 to-blue-500/70 rounded-2xl p-4 text-center shadow-lg border border-purple-400 backdrop-blur-sm'>
          <h2 className='text-white font-bold text-xl drop-shadow-lg'>Educator Portal</h2>
          <p className='text-white font-medium text-sm mt-1 drop-shadow'>Teaching Dashboard</p>
        </div>
      </div>

      {/* Mobile Logo - Bright Font */}
      <div className='px-2 mb-8 md:hidden block'>
        <div className='bg-gradient-to-r from-purple-500/70 to-blue-500/70 rounded-xl p-3 text-center shadow-lg border border-purple-400 backdrop-blur-sm'>
          <h2 className='text-white font-bold text-sm drop-shadow-lg'>Edu</h2>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className='flex-1 space-y-2 px-4'>
        {menuItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            end={item.path === '/educator'}
            className={({ isActive }) =>
              `flex items-center md:flex-row flex-col md:justify-start justify-center py-4 md:px-6 gap-4 rounded-2xl transition-all duration-300 group border-2 ${
                isActive
                  ? 'bg-white shadow-lg border-purple-500 transform scale-105'
                  : 'bg-purple-100/80 border-purple-300 hover:bg-white hover:border-purple-500 hover:transform hover:scale-105'
              }`
            }
          >
            {/* Icon Container - Subtle Active State */}
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
              ${location.pathname === item.path 
                ? 'bg-gradient-to-r from-purple-500/90 to-blue-500/90 shadow-lg' 
                : 'bg-white group-hover:bg-purple-50 border border-purple-300'
              }`
            }>
              <img 
                src={item.icon} 
                alt="" 
                className={`w-6 h-6 transition-all duration-300 ${
                  location.pathname === item.path 
                    ? 'filter brightness-0 invert opacity-90' 
                    : 'filter brightness-0 opacity-70 group-hover:opacity-100'
                }`} 
              />
            </div>
            
            {/* Text - Reduced Contrast */}
            <div className='md:block hidden flex-1'>
              <p className={`font-semibold transition-all duration-300 ${
                location.pathname === item.path ? 'text-purple-800' : 'text-gray-700 group-hover:text-purple-800'
              }`}>
                {item.name}
              </p>
              <p className={`text-sm transition-all duration-300 ${
                location.pathname === item.path ? 'text-purple-600' : 'text-gray-500 group-hover:text-purple-600'
              }`}>
                {item.name === 'Dashboard' && 'Overview analytics'}
                {item.name === 'Add Project' && 'Create new projects'}
                {item.name === "My Project's" && 'Manage courses'}
                {item.name === 'Student Enrolled' && 'Track enrollments'}
              </p>
            </div>

            {/* Active Indicator */}
            {location.pathname === item.path && (
              <div className="md:block hidden">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default SideBar;