// app/movies/[movieId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  bakedscale: string; // our backend column is "bakedscale" (lowercase)
}

export default function MovieDetailPage() {
  // Extract the dynamic parameter "movieId" from the URL
  const { movieId } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (!movieId) return;
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/movies/${movieId}`)
      .then((response) => {
        setMovie(response.data);
      })
      .catch((error) => {
        console.error("Error fetching movie details:", error);
      });
  }, [movieId]);

  if (!movie) {
    return <p>Loading movie details...</p>;
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '1rem' }}>
      <h1>{movie.title}</h1>
      <p><strong>Year:</strong> {movie.year}</p>
      <p><strong>Rating:</strong> {movie.rating}</p>
      <p><strong>BakedScale:</strong> {movie.bakedscale}</p>
    </div>
  );
}
