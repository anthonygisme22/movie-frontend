'use client';

import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Link from 'next/link';

interface UserProfile {
  id: number;
  username: string;
  email: string;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
}

interface Favorite {
  id: number;
  movieId: number;
}

interface Recommendation {
  title: string;
  posterPath: string;
  reason: string;
}

export default function DashboardPage() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to view your dashboard.');
          setLoading(false);
          return;
        }

        // Fetch Profile Data
        const profileRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(profileRes.data.user);

        // Fetch User Reviews
        const reviewsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(reviewsRes.data);

        // Fetch Favorites
        const favoritesRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(favoritesRes.data);

        // Fetch AI Recommendations
        const recommendationsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/recommendations/dashboard-ai`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecommendations(recommendationsRes.data.recommendations);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching dashboard data');
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-blue-700 text-white p-6">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6 text-center">Dashboard</h1>

      {loading ? (
        <p className="text-center text-xl">Loading dashboard...</p>
      ) : error ? (
        <p className="text-center text-red-400 text-xl">{error}</p>
      ) : (
        <div className="max-w-4xl mx-auto">
          {profile && (
            <div className="mb-8 bg-blue-800 p-4 rounded shadow">
              <h2 className="text-2xl font-bold text-yellow-400">Welcome, {profile.username}!</h2>
              <p className="mt-2">Email: {profile.email}</p>
            </div>
          )}

          {/* AI Recommendations */}
          <div className="bg-blue-800 p-4 rounded shadow">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">AI-Powered Movie Recommendations</h2>
            {recommendations.length === 0 ? (
              <p className="text-gray-300">No AI recommendations available yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="bg-blue-900 p-3 rounded shadow">
                    <img src={rec.posterPath} alt={rec.title} className="w-full h-64 object-cover rounded" />
                    <h3 className="text-xl font-bold text-yellow-400 mt-2">{rec.title}</h3>
                    <p className="text-gray-200">{rec.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
