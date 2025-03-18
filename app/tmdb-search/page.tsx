'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface TMDbMovieResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
}

export default function TMDbSearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [results, setResults] = useState<TMDbMovieResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    async function fetchSearch() {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tmdb/search`, {
          params: { query },
        });
        setResults(response.data.results);
      } catch (error) {
        console.error('TMDb search error:', error);
      }
      setLoading(false);
    }

    fetchSearch();
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">
        TMDb Search Results
      </h1>
      {loading ? (
        <p className="text-center text-gray-600">Searching...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((movie) => {
            const posterUrl = movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : '/no-image.png';
            return (
              <div
                key={movie.id}
                className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow"
              >
                <img
                  src={posterUrl}
                  alt={movie.title}
                  className="w-full h-64 object-cover mb-4 rounded"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = '/no-image.png';
                  }}
                />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{movie.title}</h2>
                <p className="text-gray-600">Release: {movie.release_date}</p>
                <p className="text-gray-600">TMDb Rating: {movie.vote_average}</p>
                <p className="text-gray-600 line-clamp-3">{movie.overview}</p>
                <Link href={`/movies/tmdb/${movie.id}`} className="mt-3 inline-block text-blue-600 hover:underline">
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
