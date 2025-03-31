'use client';

import { useState, useEffect, useContext, FormEvent } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { AuthContext } from '../context/AuthContext'; // Adjust path as needed

interface Recommendation {
  title: string;
  poster_path?: string;
  reason?: string;
}

export default function RecommendationPage() {
  // We'll assume your AuthContext provides a `user` or `token` if logged in
  const { user } = useContext(AuthContext);

  // State for AI-based recommendations (open to all, no login required)
  const [searchRecommendations, setSearchRecommendations] = useState<Recommendation[]>([]);
  const [searchPrompt, setSearchPrompt] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  // State for personal recommendations (requires login/token)
  const [personalRecommendations, setPersonalRecommendations] = useState<Recommendation[]>([]);
  const [personalError, setPersonalError] = useState('');
  const [personalLoading, setPersonalLoading] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1) AI-Based Recommendations (Public)
  //    e.g. calls /api/recommendations/chatgpt or /structured
  // ─────────────────────────────────────────────────────────────────────────────
  const fetchSearchRecommendations = async (prompt: string) => {
    setSearchLoading(true);
    setSearchError('');
    try {
      // Example route for AI-based recs. Adjust if your endpoint differs.
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/recommendations/structured`, {
        params: { prompt },
      });

      // If your backend returns { recommendations: [...] }
      const recs = res.data.recommendations || [];
      setSearchRecommendations(recs);
    } catch (err: unknown) {
      console.error('Error fetching AI-based recommendations:', err);
      if (axios.isAxiosError(err)) {
        setSearchError(err.response?.data?.message || 'Error fetching recommendations');
      } else {
        setSearchError('Error fetching recommendations');
      }
    } finally {
      setSearchLoading(false);
    }
  };

  // When user submits the AI prompt
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!searchPrompt.trim()) return;
    fetchSearchRecommendations(searchPrompt.trim());
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 2) Personal Recommendations (Requires Login)
  //    e.g. calls /api/recommendations/personal
  // ─────────────────────────────────────────────────────────────────────────────
  const fetchPersonalRecommendations = async () => {
    if (!user) return; // If not logged in, skip
    setPersonalLoading(true);
    setPersonalError('');
    try {
      // If you store the token in localStorage or user.token in AuthContext:
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      // Example route for personal recs. Adjust if your endpoint differs.
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/recommendations/personal`, {
        headers,
      });
      const recs = res.data.recommendations || [];
      setPersonalRecommendations(recs);
    } catch (err: unknown) {
      console.error('Error fetching personal recommendations:', err);
      if (axios.isAxiosError(err)) {
        setPersonalError(err.response?.data?.message || 'Could not fetch personal recommendations');
      } else {
        setPersonalError('Could not fetch personal recommendations');
      }
    } finally {
      setPersonalLoading(false);
    }
  };

  // Fetch personal recs on mount if user is logged in
  useEffect(() => {
    if (user) {
      fetchPersonalRecommendations();
    }
  }, [user]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-blue-700 text-white p-6">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6 text-center">Movie Recommendations</h1>

      {/* ──────────────────────────────────────────────────────────────────
         AI-Based (Public) Recommendations
         ────────────────────────────────────────────────────────────────── */}
      <form onSubmit={handleSearchSubmit} className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Ask AI for movie recommendations..."
          value={searchPrompt}
          onChange={(e) => setSearchPrompt(e.target.value)}
          className="px-4 py-2 rounded-l text-black w-80"
        />
        <button
          type="submit"
          className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-r hover:bg-yellow-300 transition-colors"
        >
          Ask
        </button>
      </form>

      {searchLoading ? (
        <p className="text-center text-xl">Loading recommendations...</p>
      ) : searchError ? (
        <p className="text-center text-red-400 text-xl">{searchError}</p>
      ) : searchRecommendations.length > 0 ? (
        <div>
          <h2 className="text-2xl text-yellow-300 mb-4">AI-Based Recommendations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchRecommendations.map((rec, index) => {
              const posterUrl =
                rec.poster_path && rec.poster_path.trim() !== ''
                  ? rec.poster_path
                  : '/no-image.png';
              return (
                <div key={index} className="bg-blue-800 p-4 rounded shadow hover:shadow-lg transition">
                  <Image
                    src={posterUrl}
                    alt={rec.title}
                    width={500}
                    height={600}
                    className="w-full h-64 object-cover mb-4 rounded"
                  />
                  <h2 className="text-xl font-bold text-yellow-400 mb-2">{rec.title}</h2>
                  <p className="text-sm text-gray-200 mb-2">{rec.reason || ''}</p>
                  <Link
                    href={`/movies/tmdb/${encodeURIComponent(rec.title)}`}
                    className="inline-block bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-300 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // If no AI recs yet and no error, show nothing or a placeholder
        <p className="text-center text-gray-200">No AI-based recommendations yet.</p>
      )}

      <hr className="my-8 border-yellow-400" />

      {/* ──────────────────────────────────────────────────────────────────
         Personal (Logged-In) Recommendations
         ────────────────────────────────────────────────────────────────── */}
      {!user ? (
        <p className="text-center text-xl text-yellow-300">
          Please{' '}
          <Link href="/login" className="underline">
            log in
          </Link>{' '}
          to see your personal recommendations.
        </p>
      ) : personalLoading ? (
        <p className="text-center text-xl">Loading personal recommendations...</p>
      ) : personalError ? (
        <p className="text-center text-red-400 text-xl">{personalError}</p>
      ) : personalRecommendations.length === 0 ? (
        <p className="text-center text-gray-200">No personal recommendations yet.</p>
      ) : (
        <div>
          <h2 className="text-2xl text-yellow-300 mb-4">Your Personal Recommendations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalRecommendations.map((rec, index) => {
              const posterUrl =
                rec.poster_path && rec.poster_path.trim() !== ''
                  ? rec.poster_path
                  : '/no-image.png';

              return (
                <div key={index} className="bg-blue-800 p-4 rounded shadow hover:shadow-lg transition">
                  <Image
                    src={posterUrl}
                    alt={rec.title}
                    width={500}
                    height={600}
                    className="w-full h-64 object-cover mb-4 rounded"
                  />
                  <h2 className="text-xl font-bold text-yellow-400 mb-2">{rec.title}</h2>
                  <p className="text-sm text-gray-200 mb-2">{rec.reason || ''}</p>
                  <Link
                    href={`/movies/tmdb/${encodeURIComponent(rec.title)}`}
                    className="inline-block bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-300 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
