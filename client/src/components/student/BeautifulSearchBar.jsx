import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

const BeautifulSearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchIconRef = useRef(null);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();

  // Course suggestions data
  const availableCourses = [
    'Web Development',
    'Data Science', 
    'Mobile Development',
    'UI/UX Design',
    'Digital Marketing',
    'Business Analytics',
    'Machine Learning',
    'Artificial Intelligence',
    'Cloud Computing',
    'Cyber Security'
  ];

  // Smooth opening animation (same as before)
  const openSearch = () => {
    const timeline = gsap.timeline();
    
    timeline
      .to(searchContainerRef.current, {
        width: 320,
        duration: 0.5,
        ease: "power2.out",
        borderRadius: "28px"
      })
      .to(searchContainerRef.current, {
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        duration: 0.3,
        ease: "power2.out"
      }, "-=0.3")
      .to(searchInputRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
        onStart: () => {
          gsap.set(searchInputRef.current, { 
            display: "block",
            transform: "none"
          });
        }
      }, "-=0.2");

    setIsOpen(true);
    setTimeout(() => {
      searchInputRef.current.focus();
    }, 400);
  };

  // Smooth closing animation (same as before)
  const closeSearch = () => {
    const timeline = gsap.timeline();
    
    timeline
      .to(searchInputRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in"
      })
      .to(searchContainerRef.current, {
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        duration: 0.2,
        ease: "power2.in"
      }, "-=0.1")
      .to(searchContainerRef.current, {
        width: 40,
        duration: 0.4,
        ease: "power2.inOut",
        borderRadius: "20px",
        onComplete: () => {
          gsap.set(searchInputRef.current, { display: "none" });
        }
      });

    setIsOpen(false);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleSearchClick = () => {
    if (!isOpen) {
      openSearch();
    } else {
      closeSearch();
    }
  };

  // Working search function
  const performSearch = (query) => {
    if (query && query.trim()) {
      console.log('🔍 Searching for:', query);
      
      // Navigate to course list with search query
      navigate(`/course-list/${encodeURIComponent(query)}`);
      
      // Close search bar after search
      closeSearch();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      closeSearch();
    }
    if (e.key === 'Enter' && searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  // Handle course selection from suggestions
  const handleCourseSelect = (course) => {
    performSearch(course);
  };

  // Filter courses based on search query
  const filteredCourses = availableCourses.filter(course =>
    course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Smooth suggestions animation
  useEffect(() => {
    if (suggestionsRef.current) {
      if (showSuggestions && filteredCourses.length > 0) {
        gsap.fromTo(suggestionsRef.current,
          {
            opacity: 0,
            y: -10,
            scale: 0.95
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          }
        );
      } else {
        gsap.to(suggestionsRef.current, {
          opacity: 0,
          y: -10,
          duration: 0.2,
          ease: "power2.in"
        });
      }
    }
  }, [showSuggestions, filteredCourses.length]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        closeSearch();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Search Container - Same beautiful animation */}
      <div
        ref={searchContainerRef}
        className="relative flex items-center bg-white rounded-2xl border border-gray-300 overflow-hidden transition-all duration-300"
        style={{ 
          width: 40, 
          height: 40
        }}
      >
        {/* Search Input */}
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search Projects..."
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          className="flex-1 bg-transparent outline-none px-4 text-gray-800 placeholder-gray-500 text-sm w-0 opacity-0 font-medium"
          style={{ 
            display: 'none', 
            minWidth: 0
          }}
        />
        
        {/* Search Icon with hover effect */}
        <button
          ref={searchIconRef}
          onClick={handleSearchClick}
          className="absolute right-0 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:bg-[#F3E8FF]"
        >
          <svg 
            className="w-5 h-5 text-gray-700 transition-colors duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </button>
      </div>

      {/* Search Suggestions */}
      {isOpen && showSuggestions && filteredCourses.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute top-12 left-0 w-full bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 overflow-hidden"
        >
          <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100 bg-gray-50">
            Search suggestions
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredCourses.map((course, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-3 text-sm text-gray-800 hover:bg-[#F3E8FF] hover:text-[#6D28D9] transition-colors duration-150 font-medium border-b border-gray-100 last:border-b-0"
                onClick={() => handleCourseSelect(course)}
              >
                {course}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No results message */}
      {isOpen && showSuggestions && searchQuery && filteredCourses.length === 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute top-12 left-0 w-full bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
        >
          <div className="px-4 py-3 text-sm text-gray-500 text-center">
            No courses found for "{searchQuery}"
          </div>
        </div>
      )}
    </div>
  );
};

export default BeautifulSearchBar;