/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    reactStrictMode: true,
    images: {
      // Allow Next.js Image component to load images from TMDb
      domains: ['image.tmdb.org'],
    },
    // You can add other custom configuration here if needed
  };
  
  module.exports = nextConfig;
  