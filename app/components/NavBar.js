// app/components/NavBar.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  return (
    <nav style={{
      display: 'flex',
      gap: '1rem',
      padding: '1rem',
      borderBottom: '1px solid #ccc',
      marginBottom: '1rem'
    }}>
      <Link href="/">Home</Link>
      <Link href="/recommendation">Recommendations</Link>
      {isLoggedIn ? (
        <>
          <Link href="/profile">Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
