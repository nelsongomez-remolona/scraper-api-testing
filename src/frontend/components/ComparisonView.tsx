import React from 'react';
import { Clock, DollarSign, TrendingUp } from 'lucide-react';
import { JobCard } from './JobCard';
import type { ComparisonData } from '../types';

interface ComparisonViewProps {
  data: ComparisonData;
}

export function ComparisonView({ data }: ComparisonViewProps) {
  const { serpapi, adzuna } = data;

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* SerpAPI Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">SerpAPI</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-gray-600">Results:</span>
              <span className="font-semibold">{serpapi.count}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-gray-600">Response Time:</span>
              <span className="font-semibold">{serpapi.responseTime}ms</span>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <span className="text-gray-600">Cost per Search:</span>
              <span className="font-semibold">${serpapi.costPerSearch.toFixed(4)}</span>
            </div>
          </div>
          {serpapi.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
              {serpapi.error}
            </div>
          )}
        </div>

        {/* Adzuna Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Adzuna API</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-gray-600">Results:</span>
              <span className="font-semibold">{adzuna.count}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="text-gray-600">Response Time:</span>
              <span className="font-semibold">{adzuna.responseTime}ms</span>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-gray-600">Cost per Search:</span>
              <span className="font-semibold">${adzuna.costPerSearch.toFixed(4)}</span>
            </div>
          </div>
          {adzuna.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
              {adzuna.error}
            </div>
          )}
        </div>
      </div>

      {/* Job Listings Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            SerpAPI Jobs ({serpapi.count})
          </h3>
          <div className="space-y-4">
            {serpapi.jobs.slice(0, 5).map((job, index) => (
              <JobCard key={index} job={job} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Adzuna Jobs ({adzuna.count})
          </h3>
          <div className="space-y-4">
            {adzuna.jobs.slice(0, 5).map((job, index) => (
              <JobCard key={index} job={job} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
