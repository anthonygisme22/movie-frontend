'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

// Example interface for local movies from your DB (adjust as needed)
interface LocalMovieRecord {
  id: number;
  title: string;
  year: number;
  rating: number;
  bakedscale: string;
}

// Example interface for TMDb movie data
interface TMDbMovieData {
  id: number;
  poster_path: string | null;
  title: string;
  release_date: string;
  vote_average: number;
  overview: string;
}

// (Optional) If you use a cache for TMDb lookups, declare it outside useEffect.
const tmdbCache: Record<string, TMDbMovieData> = {};

export default function MyRatingsPage() {
  const [movies, setMovies] = useState<LocalMovieRecord[]>([]);
  const [displayMovies, setDisplayMovies] = useState<TMDbMovieData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchMyRatings() {
      try {
        const res = await axios.get<LocalMovieRecord[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/movies`);
        setMovies(res.data);
        // For each local movie, fetch TMDb data by title (simulate using cache)
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
          } catch (_err) {
            console.error(`TMDb search failed for "${localMovie.title}"`);
          }
          return null;
        });
        const results = await Promise.all(promises);
        setDisplayMovies(results.filter((r): r is TMDbMovieData => r !== null));
      } catch (_err) {
        setError('Error fetching local movies');
      } finally {
        setLoading(false);
      }
    }
    fetchMyRatings();
  }, []); // tmdbCache is defined outside, so it's safe

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term === '') {
      setDisplayMovies(displayMovies); // Reset to original list if needed
    } else {
      const lowerTerm = term.toLowerCase();
      setDisplayMovies(
        displayMovies.filter((movie) =>
          movie.title.toLowerCase().includes(lowerTerm)
        )
      );
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
              <strong>Year:</strong> {movie.release_date}
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
