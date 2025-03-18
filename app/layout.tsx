// movie-frontend/app/layout.tsx
import './globals.css';
import NavBar from './components/NavBar';
import { AuthProvider } from './context/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <AuthProvider>
          <NavBar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
