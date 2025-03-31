/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useContext, FormEvent } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { AuthContext } from '../context/AuthContext';

interface AIRecommendation {
  title: string;
  poster_path?: string;
  reason?: string;
}

export default function RecommendationPage() {
  const { user } = useContext(AuthContext);

  // For AI-based recommendations
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  // For personal recommendations (requires login)
  const [personalRecommendations, setPersonalRecommendations] = useState<AIRecommendation[]>([]);
  const [personalLoading, setPersonalLoading] = useState(false);
  const [personalError, setPersonalError] = useState('');

  // Fetch AI recommendations. It attempts to parse the result if returned as a string.
  const fetchAIRecommendations = async (prompt: string) => {
    setAiLoading(true);
    setAiError('');
    setAiRecommendations([]);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/recommendations/ai`,
        { query: prompt },
        { headers: { 'Content-Type': 'application/json' } }
      );
      let data = res.data.recommendations;
      // If the response is a string, try to parse it as JSON
      if (typeof data === 'string') {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            data = parsed;
          }
        } catch (e) {
          // If parsing fails, leave data as-is.
          console.error('Error parsing AI response JSON:', e);
        }
      }
      // If data is an array, update state; otherwise, set error.
      if (Array.isArray(data)) {
        setAiRecommendations(data);
      } else {
        setAiError('AI response was not in the expected format.');
      }
    } catch (err: any) {
      console.error('Error fetching AI recommendations:', err.response?.data || err.message);
      setAiError(err.response?.data?.message || 'Error fetching AI recommendations');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAIPromptSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    fetchAIRecommendations(aiPrompt.trim());
  };

  // Fetch personal recommendations (requires login)
  const fetchPersonalRecommendations = async () => {
    if (!user) return;
    setPersonalLoading(true);
    setPersonalError('');
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/recommendations/personal`, { headers });
      setPersonalRecommendations(response.data.recommendations || []);
    } catch (err: any) {
      console.error('Error fetching personal recommendations:', err.response?.data || err.message);
      setPersonalError(err.response?.data?.message || 'Could not fetch personal recommendations');
    } finally {
      setPersonalLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPersonalRecommendations();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-blue-700 text-white p-6">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6 text-center">Movie Recommendations</h1>

      {/* AI-Based Recommendations Section */}
      <form onSubmit={handleAIPromptSubmit} className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="e.g. movies about whales..."
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          className="px-4 py-2 rounded-l text-black w-80"
        />
        <button
          type="submit"
          className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-r hover:bg-yellow-300 transition-colors"
        >
          Ask
        </button>
      </form>

      {aiLoading ? (
        <p className="text-center text-xl">Loading AI recommendations...</p>
      ) : aiError ? (
        <p className="text-center text-red-400 text-xl">{aiError}</p>
      ) : aiRecommendations.length > 0 ? (
        <>
          <h2 className="text-2xl text-yellow-300 mb-4">
            Here are some recommendations for: &quot;{aiPrompt}&quot;
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiRecommendations.map((rec, index) => {
              const posterUrl =
                rec.poster_path && rec.poster_path.trim() !== '' ? rec.poster_path : '/no-image.png';
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
                  <p className="text-sm text-gray-200 mb-2">{rec.reason || 'Recommended based on your prompt.'}</p>
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
        </>
      ) : (
        <p className="text-center text-gray-200">No AI recommendations yet.</p>
      )}

      <hr className="my-8 border-yellow-400" />

      {/* Personal Recommendations Section */}
      {!user ? (
        <p className="text-center text-xl text-yellow-300">
          Please <Link href="/login" className="underline">log in</Link> to see your personal recommendations.
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
                rec.poster_path && rec.poster_path.trim() !== '' ? rec.poster_path : '/no-image.png';
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
