'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Recommendation {
  title: string;
  posterPath: string;
  reason: string;
}

export default function RecommendationPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[] | string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");

  const fetchRecommendations = async (prompt?: string) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      // Call the structured recommendations endpoint
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/recommendations/structured`;
      if (prompt && prompt.trim() !== "") {
        url += `?prompt=${encodeURIComponent(prompt.trim())}`;
      }
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await axios.get(url, { headers });
      setRecommendations(res.data.recommendations);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error fetching recommendations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecommendations(customPrompt);
  };

  return (
    <div className="min-h-screen bg-blue-700 text-white p-6">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6 text-center">
        Movie Recommendations
      </h1>
      <form onSubmit={handleSubmit} className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Ask AI for movie recommendations..."
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          className="px-4 py-2 rounded-l text-black w-80"
        />
        <button
          type="submit"
          className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-r hover:bg-yellow-300 transition-colors"
        >
          Ask
        </button>
      </form>
      {loading ? (
        <p className="text-center text-xl">Loading recommendations...</p>
      ) : error ? (
        <p className="text-center text-red-400 text-xl">{error}</p>
      ) : Array.isArray(recommendations) ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => (
            <div key={index} className="bg-blue-800 p-4 rounded shadow hover:shadow-lg transition">
              {rec.posterPath ? (
                <img
                  src={rec.posterPath}
                  alt={rec.title}
                  className="w-full h-64 object-cover mb-4 rounded"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = "/no-image.png";
                  }}
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center bg-gray-800 mb-4 rounded">
                  <span className="text-gray-300">No Image</span>
                </div>
              )}
              <h2 className="text-xl font-bold text-yellow-400 mb-2">{rec.title}</h2>
              <p className="text-sm text-gray-200 mb-2">{rec.reason}</p>
              <Link
                href={`/movies/tmdb/${rec.title}`}
                className="inline-block bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-300 transition-colors"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto whitespace-pre-line text-lg text-gray-200">
          {recommendations}
        </div>
      )}
    </div>
  );
}
