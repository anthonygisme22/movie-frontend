'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  bakedscale: string;
  tmdbId?: number;
}

interface TMDbMovie {
  poster_path: string;
  overview: string;
  genres: { name: string }[];
}

export default function MovieDetailPage() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [tmdbData, setTmdbData] = useState<TMDbMovie | null>(null);

  useEffect(() => {
    if (!movieId) return;
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/movies/${movieId}`)
      .then((response) => {
        setMovie(response.data);
        // If the movie has a TMDb ID, fetch details from TMDb
        if (response.data.tmdbId) {
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tmdb/movie/${response.data.tmdbId}`)
            .then((tmdbResponse) => setTmdbData(tmdbResponse.data))
            .catch((error) => console.error("Error fetching TMDb data:", error));
        }
      })
      .catch((error) => console.error("Error fetching movie details:", error));
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
      <p className="text-gray-700 mb-2"><span className="font-semibold">Year:</span> {movie.year}</p>
      <p className="text-gray-700 mb-2"><span className="font-semibold">Rating:</span> {movie.rating}</p>
      <p className="text-gray-700 mb-4"><span className="font-semibold">BakedScale:</span> {movie.bakedscale}</p>
      {tmdbData && (
        <div className="mt-6">
          <img
            src={`https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`}
            alt={movie.title}
            className="w-full rounded shadow mb-4"
          />
          <p className="text-gray-700 mb-2"><span className="font-semibold">Overview:</span> {tmdbData.overview}</p>
          <p className="text-gray-700">
            <span className="font-semibold">Genres:</span>{" "}
            {tmdbData.genres.map(genre => genre.name).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
