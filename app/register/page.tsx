'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Registering with:', { username, email, password });
    // Your registration logic here
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
