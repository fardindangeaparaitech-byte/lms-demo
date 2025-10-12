import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-purple-900 to-blue-900 w-full">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <img 
                src="/final_logo.png" 
                alt="Aparaitech Logo" 
                className="h-16 w-auto"
              />
              <span className="text-xl font-bold text-white">Aparaitech</span>
            </div>
            <p className="text-purple-200 leading-relaxed max-w-md text-xs">
              Empowering students with real-world skills through live projects and industry expert mentorship.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" aria-label="Facebook" className="w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-110">
                <Facebook size={16} />
              </a>
              <a href="#" aria-label="Twitter" className="w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-400 transition-all duration-300 transform hover:scale-110">
                <Twitter size={16} />
              </a>
              <a href="#" aria-label="Instagram" className="w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-pink-600 transition-all duration-300 transform hover:scale-110">
                <Instagram size={16} />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110">
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-base mb-3">Quick Links</h3>
            <ul className="space-y-1">
              <li><a href="#" className="text-purple-200 hover:text-white transition-colors text-xs">Home</a></li>
              <li><a href="#" className="text-purple-200 hover:text-white transition-colors text-xs">Live Projects</a></li>
              <li><a href="#" className="text-purple-200 hover:text-white transition-colors text-xs">Courses</a></li>
              <li><a href="#" className="text-purple-200 hover:text-white transition-colors text-xs">Mentorship</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-base mb-3">Stay Updated</h3>
            <div className="flex flex-col gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-purple-800 border border-purple-600 text-white placeholder-purple-400 rounded-lg px-3 py-1 text-xs focus:outline-none focus:border-purple-400 transition-colors"
              />
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-1 rounded-lg font-semibold text-xs hover:from-purple-700 hover:to-blue-700 transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-purple-700">
          <div className="text-center">
            <div className="text-lg font-bold text-white">10K+</div>
            <div className="text-purple-300 text-xs">Students</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">500+</div>
            <div className="text-purple-300 text-xs">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">50+</div>
            <div className="text-purple-300 text-xs">Mentors</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">94%</div>
            <div className="text-purple-300 text-xs">Success Rate</div>
          </div>
        </div>

      </div>

      <div className="border-t border-purple-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-purple-300 text-xs">
              © 2024 Aparaitech. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-purple-300 hover:text-white text-xs transition-colors">Privacy</a>
              <a href="#" className="text-purple-300 hover:text-white text-xs transition-colors">Terms</a>
              <a href="#" className="text-purple-300 hover:text-white text-xs transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;