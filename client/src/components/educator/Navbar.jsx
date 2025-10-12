import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { UserButton, useUser } from '@clerk/clerk-react';

const Navbar = ({ bgColor }) => {

  const { userType } = useContext(AppContext) // ✅ userType use karo
  const { user } = useUser()

  // ✅ SIRF ADMIN/USERTYPE CHECK KARO, isEducator nahi
  return userType === 'admin' && user && (
    <div className={`flex items-center justify-between px-6 md:px-12 py-4 bg-gradient-to-r from-purple-500 to-purple-600 shadow-xl border-b border-purple-400`}>
      {/* Left Side - Logo */}
      <Link to="/" className="flex items-center gap-3">
        <img src="/final_logo.png" alt="Aparaitech Logo" className="h-10 w-auto drop-shadow-lg" />
        <span className="text-white text-xl font-bold">Aparaitech</span>
      </Link>

      {/* Right Side - User Info */}
      <div className="flex items-center gap-6">
        {/* Welcome Message */}
        <div className="text-white text-sm md:text-base">
          <p className="font-medium">Welcome back,</p>
          <p className="font-semibold text-white/95">{user.fullName} 👋</p>
        </div>

        {/* User Avatar with Better Styling */}
        <div className="flex items-center gap-3 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm border border-white/30">
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 border-2 border-white"
              }
            }}
          />
          <span className="text-white text-sm font-medium hidden md:block">Educator</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;