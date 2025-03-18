'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

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

export default function Home() {
  const initialFeatured: FeaturedMovie[] = [
    { tmdbId: 570670, localTitle: 'The Invisible Man' },
    { tmdbId: 27205, localTitle: 'Inception' },
    { tmdbId: 157336, localTitle: 'Interstellar' },
    { tmdbId: 550, localTitle: 'Fight Club' },
  ];

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
          } catch (error: any) {
            console.error(
              `Error fetching movie with TMDb ID ${movie.tmdbId}:`,
              error.response?.data || 'Movie not found or no data returned'
            );
            return null;
          }
        });
        const results = await Promise.all(promises);
        const validMovies = results.filter((m) => m !== null) as TMDbMovieData[];
        setFeaturedMovies(validMovies);
      } catch (error) {
        console.error('Error in fetching featured movies:', error);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16 px-4 flex flex-col items-center text-center">
        <h1 className="text-5xl font-extrabold mb-4">Welcome to My Movie DB</h1>
        <p className="text-xl max-w-2xl mb-6">
          Discover, rate, and get AI-powered recommendations for your favorite films.
        </p>
        <Link
          href="/recommendation"
          className="bg-yellow-400 text-gray-800 font-semibold px-6 py-3 rounded hover:bg-yellow-300 transition-colors"
        >
          Get Recommendations
        </Link>
      </section>

      {/* Featured Movies Section */}
      <section className="py-10 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Featured Movies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
}

interface MovieCardProps {
  movie: TMDbMovieData;
}

function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/no-image.png';

  return (
    <div className="bg-white rounded shadow hover:shadow-lg transition-shadow overflow-hidden">
      <img
        src={posterUrl}
        alt={movie.title}
        className="w-full h-64 object-cover"
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement;
          target.src = '/no-image.png';
        }}
      />
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{movie.title}</h3>
        <p className="text-gray-600 mb-1">
          <span className="font-semibold">Release:</span> {movie.release_date}
        </p>
        <p className="text-gray-600 mb-1">
          <span className="font-semibold">TMDb Rating:</span> {movie.vote_average}
        </p>
        <p className="text-gray-600">{movie.overview}</p>
        <Link href={`/movies/tmdb/${movie.id}`} className="mt-3 inline-block text-blue-600 hover:underline">
          View Details
        </Link>
      </div>
    </div>
  );
}
