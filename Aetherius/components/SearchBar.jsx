import React from 'react';

// This component takes the current search query and a function to update it.
export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          name="search"
          id="search"
          className="block w-full rounded-4xl border-1 border-gray-400 pl-10 py-3 text-lg focus:border-gray-500 focus:ring-gray-500"
          placeholder="Search for articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
}