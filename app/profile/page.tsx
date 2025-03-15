// app/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface WatchlistItem {
  id: number;
  userId: string;
  movieTitle: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch user profile
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setProfile(response.data);
      })
      .catch((error) => {
        console.error("Profile fetch error:", error);
        setErrorMsg('Error fetching profile. Please log in again.');
      });

    // Fetch user's watchlist
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/watchlist`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setWatchlist(response.data);
      })
      .catch((error) => {
        console.error("Watchlist fetch error:", error);
      });
  }, [router]);

  if (errorMsg) {
    return <p style={{ color: 'red' }}>{errorMsg}</p>;
  }

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '1rem' }}>
      <h1>Profile</h1>
      <p><strong>ID:</strong> {profile.id}</p>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Role:</strong> {profile.role}</p>
      
      <h2>Watchlist</h2>
      {watchlist.length === 0 ? (
        <p>No movies saved in your watchlist.</p>
      ) : (
        <ul>
          {watchlist.map((item) => (
            <li key={item.id}>{item.movieTitle}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
