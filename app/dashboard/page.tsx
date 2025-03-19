'use client';

import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
// Removed unused Link import.
import { AuthContext } from '../context/AuthContext';

interface UserProfile {
  id: number;
  username: string;
  email: string;
}

interface Recommendation {
  title: string;
  posterPath: string;
  reason: string;
}

// initialFeatured is now not used in this file since Dashboard fetches data from the API.

export default function DashboardPage() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState<UserProfile | null>(null);
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
        const profileRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfile(profileRes.data.user);

        // Fetch AI Recommendations
        const recommendationsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/recommendations/dashboard-ai`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecommendations(recommendationsRes.data.recommendations);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Error fetching dashboard data');
        } else {
          setError('Error fetching dashboard data');
        }
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
              <h2 className="text-2xl font-bold text-yellow-400">
                Welcome, {profile.username}!
              </h2>
              <p className="mt-2">Email: {profile.email}</p>
            </div>
          )}

          {/* AI Recommendations */}
          <div className="bg-blue-800 p-4 rounded shadow">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              AI-Powered Movie Recommendations
            </h2>
            {recommendations.length === 0 ? (
              <p className="text-gray-300">
                No AI recommendations available yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="bg-blue-900 p-3 rounded shadow">
                    {/* If you want to display an image, replace this with <Image /> */}
                    <p className="text-xl font-bold text-yellow-400 mt-2">
                      {rec.title}
                    </p>
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
