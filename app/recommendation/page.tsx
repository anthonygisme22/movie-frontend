'use client';

import { useState } from 'react';

export default function RecommendationPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    // Simulated recommendation results
    const simulated = [
      `Recommended movie based on "${query}"`,
      'Example Movie 1',
      'Example Movie 2',
    ];
    setResults(simulated);
    setQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center py-10 px-4">
      {/* White card in center */}
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-4 text-center">
          Movie Recommendations
        </h1>
        <p className="text-center text-gray-700 mb-6">
          Describe what kind of movie you're looking for and we'll suggest something!
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <textarea
            className="border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800"
            rows={4}
            placeholder="Describe what kind of movie you're looking for..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-yellow-500 text-blue-900 px-6 py-2 rounded hover:bg-yellow-600 transition-colors font-semibold"
          >
            Get Recommendations
          </button>
        </form>
        {results.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2 text-blue-900">Your Recommendations</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-800">
              {results.map((r, idx) => (
                <li key={idx}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
