import React, { useState } from 'react';
import { SearchForm } from './components/SearchForm';
import { ComparisonView } from './components/ComparisonView';
import { searchJobs } from './lib/api-clients';
import type { SearchParams, ComparisonData } from './types';

export default function App() {
  const [isSearching, setIsSearching] = useState(false);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (params: SearchParams) => {
    setIsSearching(true);
    setError(null);
    
    try {
      const data = await searchJobs(params);
      setComparisonData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setComparisonData(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Job API Comparison Tool
          </h1>
          <p className="text-gray-600">
            Compare SerpAPI vs Adzuna API for job search results
          </p>
        </header>

        <SearchForm onSearch={handleSearch} isLoading={isSearching} />

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {comparisonData && <ComparisonView data={comparisonData} />}
      </div>
    </div>
  );
}
