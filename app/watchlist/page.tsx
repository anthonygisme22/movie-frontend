'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

export default function WatchlistPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [watchlist, setWatchlist] = useState<any[]>([]); // Define an interface if available
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchWatchlist() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to view your watchlist.');
          setLoading(false);
          return;
        }
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/watchlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWatchlist(res.data);
      } catch {
        setError('Error fetching watchlist');
      } finally {
        setLoading(false);
      }
    }
    fetchWatchlist();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-700 text-white p-6 flex items-center justify-center">
        <p>Loading watchlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-700 text-white p-6 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-700 text-white p-6">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6 text-center">My Watchlist</h1>
      {watchlist.length === 0 ? (
        <p className="text-center text-gray-300">No movies in your watchlist.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlist.map((item) => {
            const posterUrl = item.posterUrl || '/no-image.png';
            return (
              <div key={item.id} className="bg-blue-800 p-4 rounded shadow hover:shadow-lg transition">
                <Image
                  src={posterUrl}
                  alt={item.title}
                  width={400}
                  height={600}
                  className="w-full h-64 object-cover mb-4 rounded"
                />
                <h2 className="text-xl font-semibold text-white mb-2">{item.title}</h2>
                <Link
                  href={`/movies/${item.id}`}
                  className="mt-3 inline-block bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-300 transition-colors"
                >
                  View Details
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
