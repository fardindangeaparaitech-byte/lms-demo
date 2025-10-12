// components/student/SearchBar.jsx
import React, { useState } from 'react';
import { assets } from '../../assets/assets';

const SearchBar = ({ onSearch, initialValue = '' }) => {
    const [query, setQuery] = useState(initialValue);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        // Optional: Real-time search (remove if you only want search on submit)
        // onSearch(value);
    };

    const clearSearch = () => {
        setQuery('');
        onSearch('');
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={query}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pl-12 pr-12 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
                <img 
                    src={assets.search_icon} 
                    alt="Search" 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                />
                {query && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                        <img src={assets.cross_icon} alt="Clear" className="w-4 h-4" />
                    </button>
                )}
            </div>
        </form>
    );
};

export default SearchBar;