'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  bakedscale: string;
  imageUrl: string;
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/movies`);
        const data = res.data.map((movie: Movie) => ({
          ...movie,
          imageUrl: movie.imageUrl || 'https://via.placeholder.com/300x400?text=No+Image',
        }));
        setMovies(data);
        setFilteredMovies(data);
      } catch {
        setError('Error fetching movies');
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term === '') {
      setFilteredMovies(movies);
    } else {
      const lowerTerm = term.toLowerCase();
      setFilteredMovies(movies.filter(movie => movie.title.toLowerCase().includes(lowerTerm)));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p>Loading movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">
        All Movies &amp; Ratings
      </h1>
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
            <Image
              src={movie.imageUrl}
              alt={movie.title}
              width={400}
              height={600}
              className="w-full h-64 object-cover mb-4 rounded"
            />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{movie.title}</h2>
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
