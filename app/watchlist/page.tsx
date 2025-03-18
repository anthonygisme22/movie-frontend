'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface WatchlistMovie {
  tmdbId: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
}

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistMovie[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('watchlist');
    if (stored) {
      setWatchlist(JSON.parse(stored));
    }
  }, []);

  const removeFromWatchlist = (tmdbId: number) => {
    const updated = watchlist.filter((movie) => movie.tmdbId !== tmdbId);
    setWatchlist(updated);
    localStorage.setItem('watchlist', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <h1 className="text-4xl font-bold text-blue-900 mb-6 text-center">My Watchlist</h1>
      {watchlist.length === 0 ? (
        <p className="text-center text-gray-700">Your watchlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlist.map((movie, index) => {
            const posterUrl = movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : '/no-image.png';
            return (
              <div
                key={`watchlist-${movie.tmdbId}-${index}`}
                className="bg-white p-4 rounded shadow"
              >
                <img
                  src={posterUrl}
                  alt={movie.title}
                  className="w-full h-64 object-cover mb-4 rounded"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/no-image.png';
                  }}
                />
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{movie.title}</h2>
                {movie.release_date && (
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Release:</span> {movie.release_date}
                  </p>
                )}
                {movie.vote_average !== undefined && (
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">TMDb Rating:</span> {movie.vote_average}
                  </p>
                )}
                <Link
                  href={`/movies/tmdb/${movie.tmdbId}`}
                  className="text-blue-800 hover:underline mb-2 inline-block"
                >
                  View Details
                </Link>
                <button
                  onClick={() => removeFromWatchlist(movie.tmdbId)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors font-semibold"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
