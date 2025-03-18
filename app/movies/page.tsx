'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function AllMoviesPage() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/movies`)
      .then(response => {
        const data = response.data.map(movie => {
          // Use the provided imageUrl or fallback to a placeholder
          const url = movie.imageUrl ? movie.imageUrl : 'https://via.placeholder.com/300x400?text=No+Image';
          console.log('Movie:', movie.title, 'Image URL:', url);
          return { ...movie, imageUrl: url };
        });
        setMovies(data);
        setFilteredMovies(data);
      })
      .catch(error => {
        console.error("Error fetching movies:", error);
      });
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term === '') {
      setFilteredMovies(movies);
    } else {
      const lowerTerm = term.toLowerCase();
      const filtered = movies.filter(movie =>
        movie.title.toLowerCase().includes(lowerTerm)
      );
      setFilteredMovies(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">All Movies & Ratings</h1>
      <div className="max-w-lg mx-auto mb-8">
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-3 border border-gray-300 rounded shadow focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMovies.map(movie => (
          <div
            key={movie.id}
            className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow"
          >
            <img
              src={movie.imageUrl}
              alt={movie.title}
              className="w-full h-64 object-cover mb-4 rounded"
              onError={(e) => {
                // If image fails to load, set src to the fallback placeholder
                e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
              }}
            />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {movie.title}
            </h2>
            <p className="text-gray-600">Year: {movie.year}</p>
            <p className="text-gray-600">Rating: {movie.rating}</p>
            <p className="text-gray-600">BakedScale: {movie.bakedscale}</p>
            <Link href={`/movies/${movie.id}`} className="mt-3 inline-block text-blue-600 hover:underline">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
