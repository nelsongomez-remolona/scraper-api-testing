import React from 'react';
import { Briefcase, MapPin, DollarSign, ExternalLink } from 'lucide-react';
import type { Job } from '../types';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900 flex-1">{job.title}</h4>
        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      <div className="space-y-1 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          <span>{job.company}</span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>

        {job.salary && (
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span>{job.salary}</span>
          </div>
        )}

        {job.posted && (
          <div className="text-xs text-gray-500 mt-2">
            Posted: {job.posted}
          </div>
        )}
      </div>

      {job.description && (
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {job.description}
        </p>
      )}
    </div>
  );
}
