'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

/**
 * Interface for your local database record.
 * Must include tmdbId if we want to fetch a real poster from TMDb.
 */
interface LocalMovieRecord {
  id: number;
  title: string;
  year: number;
  rating: number;
  bakedscale: string;
  tmdbId?: number; // Must be present if you want real TMDb images
}

/**
 * Interface for the TMDb data we fetch.
 */
interface TMDbMovieData {
  id: number;
  poster_path: string | null;
  title: string;
  release_date: string;
  vote_average: number;
  overview: string;
}

/**
 * Combined type for the final displayed movie.
 * Merges local fields + TMDb data.
 */
interface DisplayMovie {
  id: number;
  title: string;
  year: number;
  rating: number;
  bakedscale: string;
  posterUrl: string;
  overview?: string;
  release_date?: string;
  vote_average?: number;
}

export default function MyRatingsPage() {
  const [movies, setMovies] = useState<DisplayMovie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<DisplayMovie[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'top' | 'bottom' | 'all'>('top'); // Default is "Top 25"

  useEffect(() => {
    async function fetchMyRatings() {
      try {
        // 1) Fetch local records
        const res = await axios.get<LocalMovieRecord[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/movies`);
        const localRecords = res.data;

        // 2) Fetch TMDb data for movies with tmdbId
        const promises = localRecords.map(async (localMovie) => {
          if (!localMovie.tmdbId) {
            return {
              id: localMovie.id,
              title: localMovie.title,
              year: localMovie.year,
              rating: localMovie.rating,
              bakedscale: localMovie.bakedscale,
              posterUrl: '/no-image.png',
            } as DisplayMovie;
          }

          try {
            const tmdbRes = await axios.get<TMDbMovieData>(
              `${process.env.NEXT_PUBLIC_API_URL}/api/tmdb/movie/${localMovie.tmdbId}`
            );
            const tmdbData = tmdbRes.data;
            const posterUrl = tmdbData.poster_path
              ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
              : '/no-image.png';

            return {
              id: localMovie.id,
              title: tmdbData.title || localMovie.title,
              year: localMovie.year,
              rating: localMovie.rating,
              bakedscale: localMovie.bakedscale,
              posterUrl,
              release_date: tmdbData.release_date,
              vote_average: tmdbData.vote_average,
              overview: tmdbData.overview,
            } as DisplayMovie;
          } catch (error) {
            console.error(`TMDb fetch failed for ID ${localMovie.tmdbId}`, error);
            return {
              id: localMovie.id,
              title: localMovie.title,
              year: localMovie.year,
              rating: localMovie.rating,
              bakedscale: localMovie.bakedscale,
              posterUrl: '/no-image.png',
            } as DisplayMovie;
          }
        });

        const results = await Promise.all(promises);
        setMovies(results);
        applyFilter(results, 'top'); // Initially set to Top 25
      } catch (error) {
        console.error('Error fetching local movies:', error);
      }
    }

    fetchMyRatings();
  }, []);

  /**
   * Apply filter based on selected category.
   */
  const applyFilter = (moviesList: DisplayMovie[], category: 'top' | 'bottom' | 'all') => {
    let filtered: DisplayMovie[] = [];
    if (category === 'top') {
      filtered = [...moviesList].sort((a, b) => b.rating - a.rating).slice(0, 25);
    } else if (category === 'bottom') {
      filtered = [...moviesList].sort((a, b) => a.rating - b.rating).slice(0, 25);
    } else {
      filtered = moviesList;
    }
    setFilteredMovies(filtered);
    setFilter(category);
  };

  /**
   * Search function to filter displayed movies.
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term === '') {
      applyFilter(movies, filter);
    } else {
      const lowerTerm = term.toLowerCase();
      setFilteredMovies(
        movies.filter((movie) => movie.title.toLowerCase().includes(lowerTerm))
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">My Ratings</h1>

      {/* Search Bar */}
      <div className="max-w-lg mx-auto mb-6">
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
          onClick={() => applyFilter(movies, 'top')}
          className={`px-4 py-2 rounded ${filter === 'top' ? 'bg-blue-600 text-white' : 'bg-gray-200'} transition-all`}
        >
          Top 25
        </button>
        <button
          onClick={() => applyFilter(movies, 'bottom')}
          className={`px-4 py-2 rounded ${filter === 'bottom' ? 'bg-blue-600 text-white' : 'bg-gray-200'} transition-all`}
        >
          Bottom 25
        </button>
        <button
          onClick={() => applyFilter(movies, 'all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'} transition-all`}
        >
          All Movies
        </button>
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMovies.map((movie) => (
          <div key={movie.id} className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-64 object-cover mb-4 rounded"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.src = '/no-image.png';
              }}
            />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{movie.title}</h2>
            <p className="text-gray-600 mb-1"><span className="font-semibold">Year:</span> {movie.year}</p>
            <p className="text-gray-600 mb-1"><span className="font-semibold">Rating:</span> {movie.rating}</p>
            <p className="text-gray-600 mb-1">BakedScale: {movie.bakedscale}</p>
            <Link href={`/movies/${movie.id}`} className="mt-3 inline-block text-blue-600 hover:underline">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
