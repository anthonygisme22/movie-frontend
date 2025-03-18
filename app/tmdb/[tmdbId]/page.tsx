'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

interface TMDbMovie {
  id: number;
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
  const [inWatchlist, setInWatchlist] = useState<boolean>(false);

  // Fetch the movie details from your backend (which calls TMDb).
  useEffect(() => {
    if (!tmdbId) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/tmdb/movie/${tmdbId}`)
      .then((response) => {
        setTmdbData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching TMDb movie details:', error);
      });
  }, [tmdbId]);

  // Check if it's in watchlist after data is loaded
  useEffect(() => {
    if (tmdbData) {
      const stored = localStorage.getItem('watchlist');
      if (stored) {
        const watchlist = JSON.parse(stored);
        const exists = watchlist.some((movie: any) => movie.tmdbId === tmdbData.id);
        setInWatchlist(exists);
      }
    }
  }, [tmdbData]);

  // Toggle watchlist
  const toggleWatchlist = () => {
    if (!tmdbData) return;
    const stored = localStorage.getItem('watchlist');
    let watchlist = stored ? JSON.parse(stored) : [];

    const exists = watchlist.some((movie: any) => movie.tmdbId === tmdbData.id);
    if (exists) {
      // Remove it
      watchlist = watchlist.filter((m: any) => m.tmdbId !== tmdbData.id);
      setInWatchlist(false);
    } else {
      // Add it
      watchlist.push({
        tmdbId: tmdbData.id,
        title: tmdbData.title,
        poster_path: tmdbData.poster_path,
        release_date: tmdbData.release_date,
        vote_average: tmdbData.vote_average,
      });
      setInWatchlist(true);
    }

    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  };

  if (!tmdbData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">Loading TMDb movie details...</p>
      </div>
    );
  }

  // Make the image smaller
  const imageUrl = tmdbData.poster_path
    ? `https://image.tmdb.org/t/p/w300${tmdbData.poster_path}`
    : tmdbData.backdrop_path
    ? `https://image.tmdb.org/t/p/w300${tmdbData.backdrop_path}`
    : '/no-image.png';

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow rounded">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">{tmdbData.title}</h1>
      <img
        src={imageUrl}
        alt={tmdbData.title}
        className="w-full h-auto rounded mb-4"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = '/no-image.png';
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
      <p className="text-gray-700 mb-4">
        <span className="font-semibold">Genres:</span>{' '}
        {tmdbData.genres.map((g) => g.name).join(', ')}
      </p>
      <button
        onClick={toggleWatchlist}
        className="bg-yellow-500 text-blue-900 px-6 py-2 rounded hover:bg-yellow-600 transition-colors font-semibold"
      >
        {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
      </button>
    </div>
  );
}
