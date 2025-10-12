import React from 'react';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-900 to-blue-900 text-white py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex md:flex-row flex-col-reverse items-center justify-between">
          {/* Left Section - Logo and Copyright */}
          <div className='flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0'>
            <div className='flex items-center gap-3'>
              <img 
                className='w-12 h-12 md:w-14 md:h-14' 
                src="/final_logo.png" 
                alt="Aparaitech Logo" 
              />
              <span className="text-white text-lg md:text-xl font-bold">Aparaitech</span>
            </div>
            <div className='hidden md:block h-6 w-px bg-white/30'></div>
            <p className="text-center md:text-left text-sm text-white/80">
              Copyright 2025 © Aparaitech. All Rights Reserved.
            </p>
          </div>

          {/* Right Section - Social Media Icons */}
          <div className='flex items-center gap-4'>
            <a 
              href="#" 
              className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110"
            >
              <img 
                src={assets.facebook_icon} 
                alt="facebook_icon" 
                className="w-4 h-4 filter brightness-0 invert"
              />
            </a>
            <a 
              href="#" 
              className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110"
            >
              <img 
                src={assets.twitter_icon} 
                alt="twitter_icon" 
                className="w-4 h-4 filter brightness-0 invert"
              />
            </a>
            <a 
              href="#" 
              className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110"
            >
              <img 
                src={assets.instagram_icon} 
                alt="instagram_icon" 
                className="w-4 h-4 filter brightness-0 invert"
              />
            </a>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-white/20 text-center">
          <p className="text-white/60 text-xs">
            Empowering education through technology
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;