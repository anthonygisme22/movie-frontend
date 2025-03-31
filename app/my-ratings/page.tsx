/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

interface Rating {
  id: number;
  title: string;
  rating: number;
  poster_path?: string;
  // add other fields as necessary
}

export default function MyRatingsPage() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [filteredRatings, setFilteredRatings] = useState<Rating[]>([]);
  const [activeFilter, setActiveFilter] = useState<'top' | 'bottom' | 'all'>('top');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Function to fetch all ratings from the backend
  const fetchRatings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/movies/ratings`);
      // Assume the API returns an array of ratings in response.data.ratings
      const fetchedRatings: Rating[] = response.data.ratings;
      setRatings(fetchedRatings);
      applyFilter('top', fetchedRatings); // Default filter: Top 25
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching ratings');
    } finally {
      setLoading(false);
    }
  };

  // Function to filter ratings
  const applyFilter = (filter: 'top' | 'bottom' | 'all', ratingsData: Rating[] = ratings) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setFilteredRatings(ratingsData);
    } else if (filter === 'top') {
      // Sort in descending order by rating and take the first 25
      const sorted = [...ratingsData].sort((a, b) => b.rating - a.rating);
      setFilteredRatings(sorted.slice(0, 25));
    } else if (filter === 'bottom') {
      // Sort in ascending order by rating and take the first 25
      const sorted = [...ratingsData].sort((a, b) => a.rating - b.rating);
      setFilteredRatings(sorted.slice(0, 25));
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  return (
    <div className="min-h-screen bg-blue-700 text-white p-6">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6 text-center">My Ratings</h1>
      
      {/* Filter Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        <button 
          onClick={() => applyFilter('top')}
          className={`px-4 py-2 rounded ${activeFilter === 'top' ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-black'}`}
        >
          Top 25
        </button>
        <button 
          onClick={() => applyFilter('bottom')}
          className={`px-4 py-2 rounded ${activeFilter === 'bottom' ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-black'}`}
        >
          Bottom 25
        </button>
        <button 
          onClick={() => applyFilter('all')}
          className={`px-4 py-2 rounded ${activeFilter === 'all' ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-black'}`}
        >
          All Movies
        </button>
      </div>

      {loading ? (
        <p className="text-center text-xl">Loading ratings...</p>
      ) : error ? (
        <p className="text-center text-red-400 text-xl">{error}</p>
      ) : filteredRatings.length === 0 ? (
        <p className="text-center text-xl">No ratings found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRatings.map((movie) => (
            <div key={movie.id} className="bg-blue-800 p-4 rounded shadow hover:shadow-lg transition">
              <Image
                src={movie.poster_path ? movie.poster_path : '/no-image.png'}
                alt={movie.title}
                width={500}
                height={600}
                className="w-full h-64 object-cover mb-4 rounded"
              />
              <h2 className="text-xl font-bold text-yellow-400 mb-2">{movie.title}</h2>
              <p className="text-sm text-gray-200">Rating: {movie.rating}</p>
              <Link
                href={`/movies/tmdb/${movie.id}`}
                className="mt-3 inline-block bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-300 transition-colors"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
