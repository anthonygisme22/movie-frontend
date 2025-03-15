// app/profile/edit/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
}

export default function EditProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setProfile(response.data);
        setUsername(response.data.username);
        setEmail(response.data.email);
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
        setMessage('Error fetching profile. Please log in again.');
      });
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
        username,
        email,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Profile updated successfully!');
      setProfile(response.data.user);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile.');
    }
  };

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      <h1>Edit Profile</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}
