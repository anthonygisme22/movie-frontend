'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

// Minimal interface for TMDb search response
interface TMDbMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
}

interface SearchResponse {
  results: TMDbMovie[];
}

export default function TMDbSearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [movies, setMovies] = useState<TMDbMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query.trim()) {
      setMovies([]);
      return;
    }

    async function doSearch() {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get<SearchResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tmdb/search`,
          { params: { query } }
        );
        setMovies(response.data.results);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.message || 'Error performing search');
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    }

    doSearch();
  }, [query]);

  return (
    <div className="min-h-screen bg-blue-700 text-white p-6">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6 text-center">Search Results</h1>

      {loading ? (
        <p className="text-center text-xl">Searching...</p>
      ) : error ? (
        <p className="text-center text-red-400 text-xl">{error}</p>
      ) : movies.length === 0 && query.trim() !== '' ? (
        <p className="text-center text-gray-300">
          No movies found for &quot;{query}&quot;
        </p>
      ) : movies.length === 0 ? (
        <p className="text-center text-gray-300">
          Enter a search term in the NavBar to see results.
        </p>
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
                <h2 className="text-xl font-bold text-white mb-2">
                  {movie.title}
                </h2>
                <p className="text-sm text-gray-200 mb-1">
                  <strong>Release:</strong> {movie.release_date}
                </p>
                <p className="text-sm text-gray-200 mb-1">
                  <strong>TMDb Rating:</strong> {movie.vote_average}
                </p>
                <p className="text-sm text-gray-200 line-clamp-3">
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