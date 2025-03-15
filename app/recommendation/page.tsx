'use client';

import { useState, FormEvent } from 'react';
import axios from 'axios';

export default function Recommendation() {
  const [query, setQuery] = useState<string>('');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRecommendations([]);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/recommend`, { query });
      const movieList = response.data.recommendations.split('\n').filter(line => line.trim() !== '');
      setRecommendations(movieList);
    } catch (error: any) {
      console.error("Error fetching recommendations:", error);
      setRecommendations(["Error fetching recommendations."]);
    }
    setLoading(false);
  };

  const handleSaveToWatchlist = async (movieTitle: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/watchlist/add`, 
        { movieTitle }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`"${movieTitle}" added to watchlist.`);
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      setMessage("Failed to save movie.");
    }
  };

  return (
    <div>
      <h1>Movie Recommendations</h1>
      <form onSubmit={handleSubmit}>
        <textarea value={query} onChange={(e) => setQuery(e.target.value)} required />
        <button type="submit">Get Recommendations</button>
      </form>
      {message && <p>{message}</p>}
      {loading ? <p>Loading...</p> : (
        <ul>
          {recommendations.map((movie, index) => (
            <li key={index}>
              {movie} <button onClick={() => handleSaveToWatchlist(movie)}>Save</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
