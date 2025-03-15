// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  bakedscale: string;
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/movies`)
      .then(response => {
        setMovies(response.data);
      })
      .catch(error => {
        console.error("Error fetching movies:", error);
      });
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '1rem' }}>
      <h1>Movie List</h1>
      {movies.length === 0 ? (
        <p>Loading movies...</p>
      ) : (
        <ul>
          {movies.map(movie => (
            <li key={movie.id}>
              <Link href={`/movies/${movie.id}`}>
                {movie.title}
              </Link>
              {` (${movie.year}) - Rating: ${movie.rating} - BakedScale: ${movie.bakedscale}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
