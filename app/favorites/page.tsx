'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

interface FavoriteRecord {
  id: number;
  movieId: number; // The TMDb movie ID saved in favorites
  createdAt: string;
}

interface TMDbMovie {
  id: number;
  poster_path: string | null;
  title: string;
  release_date: string;
  vote_average: number;
  overview: string;
}

export default function FavoritesPage() {
  const [movies, setMovies] = useState<TMDbMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to view favorites.');
          setLoading(false);
          return;
        }
        // Fetch favorite records
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/favorites`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const favs: FavoriteRecord[] = res.data;
        // For each favorite, fetch movie details
        const moviePromises = favs.map(async (fav) => {
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/tmdb/movie/${fav.movieId}`
            );
            return response.data as TMDbMovie;
          } catch {
            return null;
          }
        });
        const results = await Promise.all(moviePromises);
        const validMovies = results.filter(
          (movie): movie is TMDbMovie => movie !== null
        );
        setMovies(validMovies);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Error fetching favorites');
        } else {
          setError('Error fetching favorites');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-700 text-white">
        <p className="text-xl">Loading favorites...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-700 text-white">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-700 text-white p-6">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6 text-center">My Favorites</h1>
      {movies.length === 0 ? (
        <p className="text-center text-gray-300">No favorites added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => {
            const posterUrl = movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : '/no-image.png';
            return (
              <div
                key={movie.id}
                className="bg-blue-800 p-4 rounded shadow hover:shadow-lg transition"
              >
                <Image
                  src={posterUrl}
                  alt={movie.title}
                  width={400}
                  height={600}
                  className="w-full h-64 object-cover mb-4 rounded"
                />
                <h2 className="text-xl font-semibold text-white mb-2">
                  {movie.title}
                </h2>
                <p className="text-gray-200 mb-1">
                  <strong>Release:</strong> {movie.release_date}
                </p>
                <p className="text-gray-200 mb-1">
                  <strong>Rating:</strong> {movie.vote_average}
                </p>
                <p className="text-gray-200 mb-1 line-clamp-3">
                  {movie.overview}
                </p>
                <Link
                  href={`/movies/tmdb/${movie.id}`}
                  className="mt-3 inline-block bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-300 transition-colors"
                >
                  View Details
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
