'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

export default function MovieDetailPage() {
  const { movieId } = useParams();
  // Ideally, define an interface instead of any
  const [movie, setMovie] = useState<any>(null);
  const [tmdbData, setTmdbData] = useState<any>(null);

  useEffect(() => {
    if (!movieId) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/movies/${movieId}`)
      .then((response) => {
        setMovie(response.data);
        if (response.data.tmdbId) {
          axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/api/tmdb/movie/${response.data.tmdbId}`)
            .then((tmdbResponse) => setTmdbData(tmdbResponse.data))
            .catch((error) =>
              console.error('Error fetching TMDb data:', error)
            );
        }
      })
      .catch((error) => console.error('Error fetching movie details:', error));
  }, [movieId]);

  if (!movie) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">Loading movie details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">{movie.title}</h1>
      <p className="text-gray-700 mb-2">
        <span className="font-semibold">Year:</span> {movie.year}
      </p>
      <p className="text-gray-700 mb-2">
        <span className="font-semibold">Rating:</span> {movie.rating}
      </p>
      <p className="text-gray-700 mb-4">
        <span className="font-semibold">BakedScale:</span> {movie.bakedscale}
      </p>
      {tmdbData && (
        <div className="mt-6">
          <Image
            src={`https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`}
            alt={movie.title}
            width={500}
            height={700}
            className="w-full rounded shadow mb-4"
          />
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Overview:</span> {tmdbData.overview}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Genres:</span>{' '}
            {tmdbData.genres.map((g: { name: string }) => g.name).join(', ')}
          </p>
        </div>
      )}
      <Link
        href="/"
        className="mt-4 inline-block bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
