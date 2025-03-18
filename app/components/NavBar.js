'use client';

import Link from 'next/link';
import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Handle the NavBar search form
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    router.push(`/tmdb-search?query=${encodeURIComponent(searchTerm.trim())}`);
    setSearchTerm('');
  };

  return (
    // A single row with 3 columns (left, center, right) ensures the center truly stays centered
    <nav className="bg-blue-700 text-white px-6 py-4 grid grid-cols-3 items-center">
      {/* LEFT COLUMN: Brand + Main Nav Links */}
      <div className="flex items-center space-x-4">
        <Link
          href="/"
          className="text-yellow-400 font-bold text-2xl px-2 py-1 rounded hover:bg-blue-600 transition"
        >
          Moovies
        </Link>
        <Link
          href="/my-ratings"
          className="text-lg px-2 py-1 rounded hover:bg-blue-600 transition"
        >
          My Ratings
        </Link>
        <Link
          href="/recommendation"
          className="text-lg px-2 py-1 rounded hover:bg-blue-600 transition"
        >
          Recommendations
        </Link>
        <Link
          href="/trending"
          className="text-lg px-2 py-1 rounded hover:bg-blue-600 transition"
        >
          Trending
        </Link>
      </div>

      {/* CENTER COLUMN: Search Bar + Advanced Search */}
      <div className="flex items-center justify-center space-x-2">
        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="flex">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-l text-black w-64"
          />
          <button
            type="submit"
            // Same width as the advanced search button
            className="w-28 bg-yellow-400 text-black font-semibold px-4 py-2 rounded-r hover:bg-yellow-300 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Advanced Search Button - same width but styled differently */}
        <Link
          href="/advanced-search"
          className="w-28 text-center font-semibold px-4 py-2 rounded border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-300 hover:text-black transition-colors"
        >
          Advanced
        </Link>
      </div>

      {/* RIGHT COLUMN: User Icon (Dashboard, Profile, Logout) or Login/Register */}
      <div className="flex items-center justify-end space-x-4">
        {!user && (
          <>
            <Link
              href="/login"
              className="text-lg px-3 py-2 rounded hover:bg-blue-600 transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-lg px-3 py-2 rounded hover:bg-blue-600 transition"
            >
              Register
            </Link>
          </>
        )}
        {user && (
          <div className="relative">
            <FaUserCircle
              className="text-3xl cursor-pointer"
              onClick={toggleDropdown}
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-blue-700 border border-blue-600 rounded shadow-lg z-50">
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 hover:bg-blue-600"
                  onClick={() => setDropdownOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-blue-600"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-blue-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
