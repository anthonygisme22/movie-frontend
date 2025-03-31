'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirm) {
      alert('Passwords do not match!');
      return;
    }

    const userData = { username, email, password };
    console.log('Registering with:', userData);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Registration successful:', response.data);
      setSuccess('Registration successful! You can now log in.');
      // Optionally, you could redirect the user to the login page:
      // router.push('/login');
    } catch (err: any) {
      console.error('Registration error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded shadow-md mx-4">
        <h1 className="text-2xl font-bold text-blue-900 mb-6 text-center">Register</h1>
        <form onSubmit={handleRegister} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <button
            type="submit"
            className="bg-yellow-500 text-blue-900 px-6 py-2 rounded hover:bg-yellow-600 transition-colors font-semibold"
          >
            Register
          </button>
        </form>
        {error && <p className="mt-4 text-center text-red-500 font-medium">{error}</p>}
        {success && <p className="mt-4 text-center text-green-500 font-medium">{success}</p>}
        <p className="mt-4 text-center text-gray-700">
          Already have an account?{' '}
          <Link href="/login" className="text-yellow-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
