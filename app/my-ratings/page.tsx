'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

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

interface DisplayMovie {
  id: number;
  tmdbId?: number;
  title: string;
  year: number;
  rating: number;
  bakedscale: string;
  posterUrl: string;
  release_date?: string;
  vote_average?: number;
  overview?: string;
}

export default function MyRatingsPage() {
  const [movies, setMovies] = useState<DisplayMovie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<DisplayMovie[]>([]);
  const [filter, setFilter] = useState<'top' | 'bottom' | 'all'>('top');
  const [loading, setLoading] = useState(true);

  const tmdbCache: Record<string, TMDbMovieData> = {};

  useEffect(() => {
    async function fetchMyRatings() {
      try {
        const res = await axios.get<LocalMovieRecord[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/movies`);
        const localRecords = res.data;

        const moviePromises = localRecords.map(async (localMovie) => {
          try {
            let tmdbData: TMDbMovieData | undefined = tmdbCache[localMovie.title];
            if (!tmdbData) {
              const searchRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tmdb/search`, {
                params: { query: localMovie.title },
              });
              const results: TMDbMovieData[] = searchRes.data.results;
              if (results && results.length > 0) {
                tmdbData = results[0];
                tmdbCache[localMovie.title] = tmdbData;
              }
            }
            const posterUrl = tmdbData?.poster_path
              ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
              : '/no-image.png';

            return {
              id: localMovie.id,
              tmdbId: tmdbData?.id,
              title: tmdbData?.title || localMovie.title,
              year: localMovie.year,
              rating: localMovie.rating,
              bakedscale: localMovie.bakedscale,
              posterUrl,
              release_date: tmdbData?.release_date,
              vote_average: tmdbData?.vote_average,
              overview: tmdbData?.overview,
            } as DisplayMovie;
          } catch (err) {
            return null;
          }
        });

        const results = await Promise.all(moviePromises);
        const validMovies = results.filter((movie): movie is DisplayMovie => movie !== null);
        setMovies(validMovies);
        applyFilter(validMovies, 'top');
      } catch (error) {
        console.error('Error fetching local movies:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMyRatings();
  }, []);

  function applyFilter(moviesList: DisplayMovie[], category: 'top' | 'bottom' | 'all') {
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
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-700 text-white">
        <p className="text-xl">Loading your rated movies...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-700 text-white p-6">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6 text-center">My Ratings</h1>

      {/* Filter Tabs */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => applyFilter(movies, 'top')}
          className={`px-4 py-2 rounded ${
            filter === 'top' ? 'bg-yellow-400 text-black' : 'bg-blue-800'
          } hover:bg-yellow-300 transition`}
        >
          Top 25
        </button>
        <button
          onClick={() => applyFilter(movies, 'bottom')}
          className={`px-4 py-2 rounded ${
            filter === 'bottom' ? 'bg-yellow-400 text-black' : 'bg-blue-800'
          } hover:bg-yellow-300 transition`}
        >
          Bottom 25
        </button>
        <button
          onClick={() => applyFilter(movies, 'all')}
          className={`px-4 py-2 rounded ${
            filter === 'all' ? 'bg-yellow-400 text-black' : 'bg-blue-800'
          } hover:bg-yellow-300 transition`}
        >
          All Movies
        </button>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMovies.map((movie) => (
          <div key={movie.id} className="bg-blue-800 p-4 rounded shadow hover:shadow-lg transition">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-64 object-cover mb-4 rounded"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.src = '/no-image.png';
              }}
            />
            <h2 className="text-xl font-semibold text-white mb-2">{movie.title}</h2>
            <p className="text-sm text-gray-200 mb-1"><strong>Year:</strong> {movie.year}</p>
            <p className="text-sm text-gray-200 mb-1"><strong>Rating:</strong> {movie.rating}</p>
            <p className="text-sm text-gray-200 mb-1"><strong>BakedScale:</strong> {movie.bakedscale}</p>
            {movie.release_date && (
              <p className="text-sm text-gray-200 mb-1"><strong>Release:</strong> {movie.release_date}</p>
            )}
            {movie.vote_average !== undefined && (
              <p className="text-sm text-gray-200 mb-1"><strong>TMDb Rating:</strong> {movie.vote_average}</p>
            )}
            <p className="text-sm text-gray-200 line-clamp-3">{movie.overview}</p>

            {movie.tmdbId ? (
              <Link
                href={`/movies/tmdb/${movie.tmdbId}`}
                className="mt-3 inline-block bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-300 transition-colors"
              >
                View Details
              </Link>
            ) : (
              <span className="mt-3 inline-block text-red-400">Details Unavailable</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
