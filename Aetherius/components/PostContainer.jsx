"use client";

import React, { useState, useMemo } from 'react';
import Featured from "./Featured";
import RecentPosts from "./Recent";
import SearchBar from "./SearchBar";

// This component is a container for both header and recent lists of posts, which has been created separately 
// to ensure that this is rendered on client side for responsiveness

export default function PostContainer({ allPosts }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering using search logic
  const filteredPosts = useMemo(() => {
    if (!searchQuery) {
      return allPosts; // If search is empty, return all posts
    }
    return allPosts.filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allPosts]);
  
  return (
    <>
      {/* Passing the state and setter function to the SearchBar */}
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      {/* Pass the *filtered* list of posts to the display components */}
      <Featured posts={filteredPosts} />
      <RecentPosts posts={filteredPosts} />
    </>
  );
}