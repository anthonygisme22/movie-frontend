/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useRef, FormEvent, useContext } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { AuthContext } from '../../../context/AuthContext';

interface TMDbMovie {
  id: number;
  poster_path: string | null;
  backdrop_path: string | null;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

interface Review {
  id: number;
  user_id: number;
  movie_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

interface CastMember {
  cast_id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Credits {
  cast: CastMember[];
  crew: any[];
}

export default function TMDbMovieDetailPage() {
  const { tmdbId } = useParams();
  const authContext = useContext(AuthContext);
  interface User {
    id: number;
    name: string;
    email: string;
    // Add other fields as needed
  }
  const user = authContext?.user as User | null;

  const [tmdbData, setTmdbData] = useState<TMDbMovie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<TMDbMovie[]>([]);
  const [trailerKey, setTrailerKey] = useState<string>('');
  const [credits, setCredits] = useState<Credits | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState<number>(0);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false);

  // For editing reviews
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editRating, setEditRating] = useState<number>(0);
  const [editComment, setEditComment] = useState('');

  // Reference for similar movies container
  const similarContainerRef = useRef<HTMLDivElement>(null);

  // Fetch movie details
  useEffect(() => {
    if (!tmdbId) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/tmdb/movie/${tmdbId}`)
      .then((res) => setTmdbData(res.data))
      .catch((err) => console.error('Error fetching movie details:', err));
  }, [tmdbId]);

  // Fetch similar movies
  useEffect(() => {
    if (!tmdbId) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/tmdb/movie/${tmdbId}/similar`)
      .then((res) => setSimilarMovies(res.data.results))
      .catch((err) => console.error('Error fetching similar movies:', err));
  }, [tmdbId]);

  // Fetch movie videos for trailer
  useEffect(() => {
    if (!tmdbId) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/tmdb/movie/${tmdbId}/videos`)
      .then((res) => {
        const videos = res.data.results;
        const trailer = videos.find((video: any) => video.site === 'YouTube' && video.type === 'Trailer');
        if (trailer) setTrailerKey(trailer.key);
      })
      .catch((err) => console.error('Error fetching movie videos:', err));
  }, [tmdbId]);

  // Fetch movie credits (for cast & crew)
  useEffect(() => {
    if (!tmdbId) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/tmdb/movie/${tmdbId}/credits`)
      .then((res) => setCredits(res.data))
      .catch((err) => console.error('Error fetching movie credits:', err));
  }, [tmdbId]);

  // Fetch reviews for the movie
  useEffect(() => {
    if (!tmdbId) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${tmdbId}`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error('Error fetching reviews:', err));
  }, [tmdbId, refresh]);

  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to post a review.');
        return;
      }
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews`,
        { movieId: Number(tmdbId), rating: newRating, comment: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewRating(0);
      setNewComment('');
      setRefresh(!refresh);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error submitting review');
    }
  };

  const handleEditSubmit = async (e: FormEvent, reviewId: number) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to update a review.');
        return;
      }
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${reviewId}`,
        { rating: editRating, comment: editComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingReviewId(null);
      setRefresh(!refresh);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error updating review');
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to delete a review.');
        return;
      }
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRefresh(!refresh);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error deleting review');
    }
  };

  // Use poster image if available; otherwise use backdrop
  const imageUrl = tmdbData?.poster_path
    ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
    : tmdbData?.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${tmdbData.backdrop_path}`
    : '/no-image.png';

  // Functions to scroll similar movies container
  const scrollLeft = () => {
    if (similarContainerRef.current) {
      similarContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (similarContainerRef.current) {
      similarContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-blue-700 text-white min-h-screen p-4 md:p-8">
      {!tmdbData ? (
        <p className="text-center text-gray-300">Loading movie details...</p>
      ) : (
        <div className="max-w-6xl mx-auto">
          {/* Top Section: Two-Column Layout for Poster & Main Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <img
                src={imageUrl}
                alt={tmdbData.title}
                className="w-full h-auto max-h-[500px] rounded shadow"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = '/no-image.png';
                }}
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-yellow-400 mb-4">{tmdbData.title}</h1>
              <p className="mb-2"><strong>Release Date:</strong> {tmdbData.release_date}</p>
              <p className="mb-2"><strong>TMDb Rating:</strong> {tmdbData.vote_average}</p>
              <p className="mb-4">{tmdbData.overview}</p>
            </div>
          </div>

          {/* Trailer Section */}
          {trailerKey && (
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-yellow-400 mb-4">Trailer</h2>
              <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded shadow"
                  src={`https://www.youtube.com/embed/${trailerKey}`}
                  title="Movie Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* Similar Movies Carousel */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">Similar Movies</h2>
            {similarMovies.length === 0 ? (
              <p className="text-gray-300">No similar movies found.</p>
            ) : (
              <div className="relative">
                <button
                  onClick={scrollLeft}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-blue-800 text-yellow-400 p-2 rounded-full hover:bg-blue-600"
                >
                  &#9664;
                </button>
                <div
                  ref={similarContainerRef}
                  className="overflow-x-scroll whitespace-nowrap scroll-snap-x snap-mandatory scrollbar-hide mx-8"
                >
                  {similarMovies.map((movie) => (
                    <div key={movie.id} className="inline-block mr-4 snap-start bg-blue-800 p-2 rounded shadow">
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : '/no-image.png'
                        }
                        alt={movie.title}
                        className="w-full h-48 object-cover rounded mb-2"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.src = '/no-image.png';
                        }}
                      />
                      <h3 className="text-md font-bold text-yellow-400 mb-2">{movie.title}</h3>
                      <Link
                        href={`/movies/tmdb/${movie.id}`}
                        className="block bg-yellow-400 text-black text-center px-3 py-1 rounded hover:bg-yellow-300 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  ))}
                </div>
                <button
                  onClick={scrollRight}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-blue-800 text-yellow-400 p-2 rounded-full hover:bg-blue-600"
                >
                  &#9654;
                </button>
              </div>
            )}
          </div>

          {/* Cast & Crew Section */}
          {credits && credits.cast && credits.cast.length > 0 && (
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-yellow-400 mb-4">Cast & Crew</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {credits.cast.slice(0, 8).map((member: CastMember) => (
                  <div key={member.cast_id} className="bg-blue-800 p-2 rounded shadow">
                    <img
                      src={
                        member.profile_path
                          ? `https://image.tmdb.org/t/p/w300${member.profile_path}`
                          : '/no-image.png'
                      }
                      alt={member.name}
                      className="w-full h-40 object-cover rounded mb-2"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.src = '/no-image.png';
                      }}
                    />
                    <h3 className="text-md font-bold text-yellow-400">{member.name}</h3>
                    <p className="text-sm text-gray-300">{member.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">Reviews</h2>
            {error && <p className="text-red-400 mb-4">{error}</p>}
            {reviews.length === 0 ? (
              <p className="text-gray-300">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="mb-4 border-b border-blue-600 pb-2">
                  <p><strong>Rating:</strong> {review.rating} / 10</p>
                  <p>{review.comment}</p>
                  <p className="text-sm text-gray-300">{new Date(review.created_at).toLocaleString()}</p>
                  {user && review.user_id === user.id && (
                    <div className="mt-2 space-x-2">
                      <button
                        className="text-yellow-400 hover:underline"
                        onClick={() => {
                          setEditingReviewId(review.id);
                          setEditRating(review.rating);
                          setEditComment(review.comment);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  {editingReviewId === review.id && (
                    <form
                      onSubmit={(e) => handleEditSubmit(e, review.id)}
                      className="mt-2 bg-blue-800 p-2 rounded"
                    >
                      <div className="mb-2">
                        <label className="block mb-1">Rating (0-10):</label>
                        <input
                          type="number"
                          value={editRating}
                          onChange={(e) => setEditRating(Number(e.target.value))}
                          className="w-full p-2 rounded border border-blue-600 bg-blue-600 text-white"
                          min="0"
                          max="10"
                          required
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block mb-1">Comment:</label>
                        <textarea
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          className="w-full p-2 rounded border border-blue-600 bg-blue-600 text-white"
                          rows={2}
                        ></textarea>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-300"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingReviewId(null)}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ))
            )}
            <form onSubmit={handleReviewSubmit} className="mt-6 bg-blue-800 p-4 rounded">
              <h3 className="text-2xl font-bold text-yellow-400 mb-2">Add a Review</h3>
              <div className="mb-2">
                <label className="block mb-1">Rating (0-10):</label>
                <input
                  type="number"
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="w-full p-2 rounded border border-blue-600 bg-blue-600 text-white"
                  min="0"
                  max="10"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">Comment:</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-2 rounded border border-blue-600 bg-blue-600 text-white"
                  rows={3}
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-300 transition-colors"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
