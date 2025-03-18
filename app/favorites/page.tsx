'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

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
  const [favorites, setFavorites] = useState<FavoriteRecord[]>([]);
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
        // Fetch favorite records from the favorites endpoint
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/favorites`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const favs: FavoriteRecord[] = res.data;
        setFavorites(favs);

        // For each favorite record, fetch full movie details from the TMDb endpoint
        const moviePromises = favs.map(async (fav) => {
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/tmdb/movie/${fav.movieId}`
            );
            return response.data as TMDbMovie;
          } catch (err) {
            return null;
          }
        });
        const results = await Promise.all(moviePromises);
        const validMovies = results.filter((movie): movie is TMDbMovie => movie !== null);
        setMovies(validMovies);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching favorites');
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading favorites...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">My Favorites</h1>
      {movies.length === 0 ? (
        <p className="text-center text-gray-600">No favorites added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
              <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/no-image.png'}
                alt={movie.title}
                className="w-full h-64 object-cover mb-4 rounded"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = '/no-image.png';
                }}
              />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{movie.title}</h2>
              <p className="text-gray-600 mb-1"><strong>Release:</strong> {movie.release_date}</p>
              <p className="text-gray-600 mb-1"><strong>Rating:</strong> {movie.vote_average}</p>
              <p className="text-gray-600 mb-1 line-clamp-3">{movie.overview}</p>
              <Link href={`/movies/tmdb/${movie.id}`} className="mt-3 inline-block text-blue-600 hover:underline">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
