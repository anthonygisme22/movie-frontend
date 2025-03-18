'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/login');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    router.push(`/tmdb-search?query=${encodeURIComponent(searchTerm.trim())}`);
    setSearchTerm('');
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-blue-600 text-white shadow-md">
      <div className="flex items-center space-x-4">
        <Link href="/" className="hover:text-gray-300">
          Home
        </Link>
        <Link href="/my-ratings" className="hover:text-gray-300">
          My Ratings
        </Link>
        <Link href="/recommendation" className="hover:text-gray-300">
          Recommendations
        </Link>
      </div>

      {/* Global Search Bar */}
      <form onSubmit={handleSubmit} className="hidden md:flex items-center space-x-2 mx-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search any movie..."
          className="px-3 py-2 rounded-l border-none focus:outline-none text-black w-64"
        />
        <button
          type="submit"
          className="bg-yellow-400 text-gray-800 font-semibold px-4 py-2 rounded-r hover:bg-yellow-300 transition-colors"
        >
          Search
        </button>
      </form>

      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <Link href="/profile" className="hover:text-gray-300">
              Profile
            </Link>
            <button onClick={handleLogout} className="hover:text-gray-300">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-gray-300">
              Login
            </Link>
            <Link href="/register" className="hover:text-gray-300">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
