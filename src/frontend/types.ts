export interface SearchParams {
  query: string;
  location: string;
  maxResults?: number;
}

export interface Job {
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  url?: string;
  posted?: string;
}

export interface ApiResult {
  provider: string;
  jobs: Job[];
  count: number;
  responseTime: number;
  costPerSearch: number;
  error?: string;
}

export interface ComparisonData {
  serpapi: ApiResult;
  adzuna: ApiResult;
  timestamp: string;
}
