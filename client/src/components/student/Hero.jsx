import React from 'react';
import SearchBar from '../../components/student/SearchBar';
import HeroSlider from './HeroSlider';

const Hero = () => {
  return (
    <div className="flex flex-col items-center w-full space-y-8 bg-transparent">
      {/* Full width slider with 400px height */}
      <HeroSlider />
      
      {/* Search bar below slider */}
      <div className="w-full max-w-7xl px-4">
        <div className="max-w-2xl mx-auto">
          <SearchBar />
        </div>
      </div>
    </div>
  );
};

export default Hero;