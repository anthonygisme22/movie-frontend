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
  rating: number; // Your numeric rating from the DB
  bakedscale: string;
}

interface TMDbMovieData {
  id: number;
  poster_path: string | null;
  title: string;
  release_date: string;
  vote_average: number;
  overview: string;
  localRating?: number; // Will store your local rating
}

// Optional: Use a simple cache to avoid refetching TMDb data for the same title.
const tmdbCache: Record<string, TMDbMovieData> = {};

export default function MyRatingsPage() {
  const [displayMovies, setDisplayMovies] = useState<TMDbMovieData[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<TMDbMovieData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'top' | 'bottom' | 'all'>('top');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch local movie records and their corresponding TMDb data.
  useEffect(() => {
    async function fetchMyRatings() {
      try {
        const res = await axios.get<LocalMovieRecord[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/movies`);
        const promises = res.data.map(async (localMovie) => {
          if (tmdbCache[localMovie.title]) {
            const movie = tmdbCache[localMovie.title];
            return { ...movie, localRating: localMovie.rating };
          }
          try {
            const searchRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tmdb/search`, {
              params: { query: localMovie.title },
            });
            const results = searchRes.data.results;
            if (results && results.length > 0) {
              const tmdbMovie = results[0] as TMDbMovieData;
              tmdbCache[localMovie.title] = tmdbMovie;
              return { ...tmdbMovie, localRating: localMovie.rating };
            }
          } catch {
            return null;
          }
          return null;
        });
        const results = await Promise.all(promises);
        // Ensure we only include movies that are not null and have a defined localRating
        const validMovies = results.filter((movie): movie is TMDbMovieData & { localRating: number } => movie !== null && movie.localRating !== undefined);
        setDisplayMovies(validMovies.filter((movie): movie is TMDbMovieData & { localRating: number } => movie !== null && movie.localRating !== undefined));
        // Apply default filter: Top 25
        applyFilter('top', validMovies);
      } catch {
        setError('Error fetching local movies');
      } finally {
        setLoading(false);
      }
    }
    fetchMyRatings();
  }, []);

  // Function to apply a filter based on your local ratings.
  const applyFilter = (filter: 'top' | 'bottom' | 'all', moviesData?: TMDbMovieData[]) => {
    setActiveFilter(filter);
    const movies = moviesData || displayMovies;
    let sorted: TMDbMovieData[];
    if (filter === 'top') {
      // Sort descending: highest localRating first.
      sorted = [...movies].sort((a, b) => (b.localRating! - a.localRating!));
      setFilteredMovies(sorted.slice(0, 25));
    } else if (filter === 'bottom') {
      // Sort ascending: lowest localRating first.
      sorted = [...movies].sort((a, b) => (a.localRating! - b.localRating!));
      setFilteredMovies(sorted.slice(0, 25));
    } else {
      setFilteredMovies(movies);
    }
  };

  // Handle search input changes.
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term === '') {
      applyFilter(activeFilter);
    } else {
      const lowerTerm = term.toLowerCase();
      setFilteredMovies(
        displayMovies.filter((movie) => movie.title.toLowerCase().includes(lowerTerm))
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
      {/* Search Input */}
      <div className="max-w-lg mx-auto mb-8">
        <input
          type="text"
          placeholder="Search your rated movies..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-3 border border-blue-300 rounded shadow focus:outline-none focus:ring focus:ring-blue-300 transition-all"
        />
      </div>
      {/* Filter Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => applyFilter('top')}
          className={`px-4 py-2 rounded ${
            activeFilter === 'top' ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-black'
          }`}
        >
          Top 25
        </button>
        <button
          onClick={() => applyFilter('bottom')}
          className={`px-4 py-2 rounded ${
            activeFilter === 'bottom' ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-black'
          }`}
        >
          Bottom 25
        </button>
        <button
          onClick={() => applyFilter('all')}
          className={`px-4 py-2 rounded ${
            activeFilter === 'all' ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-black'
          }`}
        >
          All Movies
        </button>
      </div>
      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMovies.map((movie) => (
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
            <p className="text-sm text-gray-200 mb-1">
              <strong>Your Rating:</strong> {movie.localRating}
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
