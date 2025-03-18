import './globals.css';
import NavBar from './components/NavBar'; // Adjust path if needed

export const metadata = {
  title: 'Movie DB',
  description: 'Discover, rate, and get AI-Powered recommendations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
