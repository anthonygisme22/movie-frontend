'use client';

import { useContext, useEffect, useState, FormEvent } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';

interface TMDbMovie {
  id: number;
  poster_path: string | null;
  title: string;
  release_date: string;
  vote_average: number;
  overview: string;
}

interface FavoriteRecord {
  id: number;
  movieId: number;
}

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState<any>(null);
  const [favorites, setFavorites] = useState<TMDbMovie[]>([]);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  // Initialize with empty strings to keep inputs controlled
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function fetchProfileAndFavorites() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in.');
          return;
        }
        // Fetch Profile
        const profileRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfile(profileRes.data.user);
        // Ensure controlled inputs always get a string
        setEditUsername(profileRes.data.user.username || '');
        setEditEmail(profileRes.data.user.email || '');

        // Fetch Favorites
        const favRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/favorites`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const favRecords: FavoriteRecord[] = favRes.data;

        // For each favorite, fetch TMDb details
        const moviePromises = favRecords.map(async (fav) => {
          try {
            const res = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/tmdb/movie/${fav.movieId}`
            );
            return res.data as TMDbMovie;
          } catch {
            return null;
          }
        });
        const results = await Promise.all(moviePromises);
        const validMovies = results.filter((m): m is TMDbMovie => m !== null);
        setFavorites(validMovies);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching data');
      }
    }

    if (user) {
      fetchProfileAndFavorites();
    }
  }, [user, refresh]);

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in.');
        return;
      }
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
        { username: editUsername, email: editEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(res.data.user);
      setEditing(false);
      setRefresh(!refresh);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error updating profile');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {!profile ? (
        <p>Loading profile...</p>
      ) : (
        <>
          <div className="flex items-center space-x-4 mb-8">
            <FaUserCircle className="text-4xl text-yellow-400" />
            <div>
              <h1 className="text-3xl font-bold text-yellow-400 mb-1">
                {profile.username}'s Profile
              </h1>
              <p><strong>Email:</strong> {profile.email}</p>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="ml-4 bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-300"
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {editing && (
            <form onSubmit={handleEditSubmit} className="mb-8">
              <div className="mb-4">
                <label className="block mb-1">Username:</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full p-2 rounded border border-gray-700 bg-gray-800 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Email:</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full p-2 rounded border border-gray-700 bg-gray-800 text-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-300 transition-colors"
              >
                Save Changes
              </button>
            </form>
          )}

          <h2 className="text-2xl font-bold text-yellow-400 mb-4">My Favorites</h2>
          {favorites.length === 0 ? (
            <p className="text-gray-300">No favorites added yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-gray-800 p-4 rounded shadow hover:shadow-lg transition-shadow"
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : '/no-image.png'
                    }
                    alt={movie.title}
                    className="w-full h-64 object-cover mb-4 rounded"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.src = '/no-image.png';
                    }}
                  />
                  <h3 className="text-xl font-semibold mb-2">{movie.title}</h3>
                  <p className="mb-1"><strong>Release:</strong> {movie.release_date}</p>
                  <p className="mb-1"><strong>Rating:</strong> {movie.vote_average}</p>
                  <p className="mb-1 line-clamp-3">{movie.overview}</p>
                  <Link
                    href={`/movies/tmdb/${movie.id}`}
                    className="mt-3 inline-block text-yellow-400 hover:text-yellow-300"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
          {error && <p className="mt-4 text-red-400">{error}</p>}
        </>
      )}
    </div>
  );
}
