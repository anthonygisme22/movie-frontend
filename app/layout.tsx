// movie-frontend/app/layout.tsx
import './globals.css';
import NavBar from './components/NavBar';
import { AuthProvider } from './context/AuthContext';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>My Movie DB</title>
      </head>
      <body className="bg-gray-50 min-h-screen">
        <AuthProvider>
          <NavBar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
