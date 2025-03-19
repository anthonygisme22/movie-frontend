'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image';

interface FeaturedMovie {
  tmdbId: number;
  localTitle: string;
}

interface TMDbMovieData {
  id: number;
  poster_path: string | null;
  title: string;
  release_date: string;
  vote_average: number;
  overview: string;
}

// Move the constant outside the component to avoid dependency warnings.
const initialFeatured: FeaturedMovie[] = [
  { tmdbId: 157336, localTitle: 'Interstellar' },
  { tmdbId: 27205, localTitle: 'Inception' },
  { tmdbId: 550, localTitle: 'Fight Club' },
  { tmdbId: 335797, localTitle: 'Sing' },
];

export default function Home() {
  const [featuredMovies, setFeaturedMovies] = useState<TMDbMovieData[]>([]);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const promises = initialFeatured.map(async (movie) => {
          try {
            const res = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/tmdb/movie/${movie.tmdbId}`
            );
            return res.data as TMDbMovieData;
          } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
              console.error(
                `Error fetching TMDb movie ID ${movie.tmdbId}:`,
                error.response?.data || 'No data'
              );
            } else {
              console.error(`Error fetching TMDb movie ID ${movie.tmdbId}:`, error);
            }
            return null;
          }
        });
        const results = await Promise.all(promises);
        // Filter out any null values
        setFeaturedMovies(results.filter((movie): movie is TMDbMovieData => movie !== null));
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error('Error fetching featured movies:', error.response?.data || 'Unknown error');
        } else {
          console.error('Error fetching featured movies:', error);
        }
      }
    }
    fetchFeatured();
  }, []); // initialFeatured is constant, so dependency array is safe

  return (
    <div className="min-h-screen bg-blue-700 text-white">
      {/* Hero Section */}
      <section className="px-4 py-16 text-center">
        <h1 className="text-5xl font-extrabold text-yellow-400 mb-4">
          Welcome to My Movie DB
        </h1>
        <p className="text-xl max-w-2xl mx-auto mb-6">
          Discover, rate, and get AI-powered recommendations for your favorite films.
        </p>
        <Link
          href="/recommendation"
          className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded hover:bg-yellow-300 transition-colors"
        >
          Get Recommendations
        </Link>
      </section>

      {/* Featured Movies Section */}
      <section className="px-4 pb-16">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6">Featured Movies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredMovies.map((movie) => (
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
                width={500}
                height={400}
                className="w-full h-64 object-cover mb-4 rounded"
              />
              <h3 className="text-xl font-bold text-white mb-2">{movie.title}</h3>
              <p className="text-sm text-gray-200 mb-1">
                <strong>Release:</strong> {movie.release_date}
              </p>
              <p className="text-sm text-gray-200 mb-2">
                <strong>TMDb Rating:</strong> {movie.vote_average}
              </p>
              <p className="text-sm text-gray-200 line-clamp-3">{movie.overview}</p>
              <Link
                href={`/movies/tmdb/${movie.id}`}
                className="mt-3 inline-block bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-300 transition-colors"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
