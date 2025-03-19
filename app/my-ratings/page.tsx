'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

// Define interfaces for local movie records and TMDb data
interface LocalMovieRecord {
  id: number;
  title: string;
  year: number;
  rating: number;
  bakedscale: string;
}

interface TMDbMovieData {
  id: number;
  poster_path: string | null;
  title: string;
  release_date: string;
  vote_average: number;
  overview: string;
}

// Optional: Use a simple cache so repeated lookups for a title aren’t refetched.
const tmdbCache: Record<string, TMDbMovieData> = {};

export default function MyRatingsPage() {
  // Use separate state names to avoid unused variable warnings
  const [localMovies, setLocalMovies] = useState<LocalMovieRecord[]>([]);
  const [displayMovies, setDisplayMovies] = useState<TMDbMovieData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchMyRatings() {
      try {
        const res = await axios.get<LocalMovieRecord[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/movies`);
        setLocalMovies(res.data);
        // For each local movie, fetch TMDb data by title
        const promises = res.data.map(async (localMovie) => {
          if (tmdbCache[localMovie.title]) {
            return tmdbCache[localMovie.title];
          }
          try {
            const searchRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tmdb/search`, {
              params: { query: localMovie.title },
            });
            const results = searchRes.data.results;
            if (results && results.length > 0) {
              const tmdbMovie = results[0] as TMDbMovieData;
              tmdbCache[localMovie.title] = tmdbMovie;
              return tmdbMovie;
            }
          } catch (_err: unknown) {
            // Removed unused error variable
            return null;
          }
          return null;
        });
        const results = await Promise.all(promises);
        setDisplayMovies(results.filter((movie): movie is TMDbMovieData => movie !== null));
      } catch {
        setError('Error fetching local movies');
      } finally {
        setLoading(false);
      }
    }
    fetchMyRatings();
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term === '') {
      // If search is empty, reset filtered movies to all movies (or you can decide on a different behavior)
      setDisplayMovies(displayMovies);
    } else {
      const lowerTerm = term.toLowerCase();
      setDisplayMovies(displayMovies.filter(movie => movie.title.toLowerCase().includes(lowerTerm)));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-700 text-white p-6 flex items-center justify-center">
        <p>Loading your rated movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-700 text-white p-6 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-700 text-white p-6">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6 text-center">My Ratings</h1>
      <div className="max-w-lg mx-auto mb-8">
        <input
          type="text"
          placeholder="Search your rated movies..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-3 border border-blue-300 rounded shadow focus:outline-none focus:ring focus:ring-blue-300 transition-all"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayMovies.map((movie) => (
          <div
            key={movie.id}
            className="bg-blue-800 p-4 rounded shadow hover:shadow-lg transition"
          >
            <Image
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : '/no-image.png'
              }
              alt={movie.title}
              width={400}
              height={600}
              className="w-full h-64 object-cover mb-4 rounded"
            />
            <h2 className="text-xl font-semibold text-white mb-2">{movie.title}</h2>
            <p className="text-sm text-gray-200 mb-1">
              <strong>Release:</strong> {movie.release_date}
            </p>
            <p className="text-sm text-gray-200 mb-1">
              <strong>TMDb Rating:</strong> {movie.vote_average}
            </p>
            <p className="text-sm text-gray-200 mb-1 line-clamp-3">{movie.overview}</p>
            <Link
              href={`/movies/tmdb/${movie.id}`}
              className="mt-3 inline-block bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-300 transition-colors"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
