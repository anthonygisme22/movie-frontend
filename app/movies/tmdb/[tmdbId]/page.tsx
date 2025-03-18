'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

interface TMDbMovie {
  poster_path: string | null;
  backdrop_path: string | null;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genres: { name: string }[];
}

export default function TMDbMovieDetailPage() {
  const { tmdbId } = useParams();
  const [tmdbData, setTmdbData] = useState<TMDbMovie | null>(null);

  useEffect(() => {
    if (!tmdbId) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/tmdb/movie/${tmdbId}`)
      .then((response) => setTmdbData(response.data))
      .catch((error) => console.error('Error fetching TMDb movie details:', error));
  }, [tmdbId]);

  if (!tmdbData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">Loading TMDb movie details...</p>
      </div>
    );
  }

  const imageUrl = tmdbData.poster_path
    ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
    : tmdbData.backdrop_path
      ? `https://image.tmdb.org/t/p/w500${tmdbData.backdrop_path}`
      : '/no-image.png';

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">{tmdbData.title}</h1>
      <img
        src={imageUrl}
        alt={tmdbData.title}
        className="w-full h-auto rounded mb-4"
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement;
          target.src = '/no-image.png';
        }}
      />
      <p className="text-gray-700 mb-2">
        <span className="font-semibold">Release Date:</span> {tmdbData.release_date}
      </p>
      <p className="text-gray-700 mb-2">
        <span className="font-semibold">TMDb Rating:</span> {tmdbData.vote_average}
      </p>
      <p className="text-gray-700 mb-2">
        <span className="font-semibold">Overview:</span> {tmdbData.overview}
      </p>
      <p className="text-gray-700">
        <span className="font-semibold">Genres:</span> {tmdbData.genres.map(g => g.name).join(', ')}
      </p>
    </div>
  );
}
