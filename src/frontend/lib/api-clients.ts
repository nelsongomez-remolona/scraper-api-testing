import type { Job, ApiResult, SearchParams } from '../types';
import { API_CONFIG } from '../config/api-config';

const SERPAPI_COST_PER_SEARCH = 0.01;
const ADZUNA_COST_PER_SEARCH = 0.00;

/**
 * Search using your Railway job scraper service
 */
export async function searchSerpAPI(params: SearchParams): Promise<ApiResult> {
  const { query, location, maxResults = 20 } = params;
  const startTime = Date.now();

  try {
    // Call the local backend API
    const API_URL = '/api/search';

    const requestBody = {
      what: query,
      where: location,
      limit: maxResults,
    };

    console.log('Calling /api/search with:', requestBody);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const responseTime = Date.now() - startTime;

    if (!data.success) {
      throw new Error(data.error || 'Search failed');
    }

    const jobs: Job[] = (data.jobs || []).map((job: any) => ({
      title: job.title || 'Untitled',
      company: job.company || 'Unknown Company',
      location: job.location || location,
      salary: undefined,
      description: job.description || job.snippet || '',
      url: job.url || '#',
      posted: job.postedDate || undefined,
    }));

    return {
      provider: 'SerpAPI',
      jobs,
      responseTime,
      count: data.total || data.count || jobs.length,
      costPerSearch: SERPAPI_COST_PER_SEARCH,
    };
  } catch (error) {
    console.error('API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      provider: 'SerpAPI',
      jobs: [],
      responseTime: Date.now() - startTime,
      count: 0,
      costPerSearch: SERPAPI_COST_PER_SEARCH,
      error: errorMessage,
    };
  }
}

/**
 * Search using Adzuna API
 */
export async function searchAdzuna(params: SearchParams): Promise<ApiResult> {
  const { query, location, maxResults = 20 } = params;
  const startTime = Date.now();

  try {
    const appId = API_CONFIG.adzuna.appId;
    const appKey = API_CONFIG.adzuna.appKey;

    if (!appId || !appKey || !API_CONFIG.adzuna.enabled) {
      return {
        provider: 'Adzuna',
        jobs: [],
        responseTime: Date.now() - startTime,
        count: 0,
        costPerSearch: ADZUNA_COST_PER_SEARCH,
        error: 'Adzuna not configured. Add your App ID to /config/api-config.ts',
      };
    }

    const searchParams = new URLSearchParams({
      app_id: appId,
      app_key: appKey,
      results_per_page: maxResults.toString(),
      what: query,
      where: location,
    });

    const country = 'us';
    const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?${searchParams}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Adzuna HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const responseTime = Date.now() - startTime;

    const jobs: Job[] = (data.results || []).map((job: any) => {
      let salary: string | undefined;
      if (job.salary_min && job.salary_max) {
        salary = `$${Math.round(job.salary_min).toLocaleString()} - $${Math.round(job.salary_max).toLocaleString()}`;
      } else if (job.salary_min) {
        salary = `From $${Math.round(job.salary_min).toLocaleString()}`;
      } else if (job.salary_max) {
        salary = `Up to $${Math.round(job.salary_max).toLocaleString()}`;
      }

      let posted: string | undefined;
      if (job.created) {
        const date = new Date(job.created);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
          posted = 'Today';
        } else if (diffDays === 1) {
          posted = 'Yesterday';
        } else if (diffDays < 7) {
          posted = `${diffDays} days ago`;
        } else if (diffDays < 30) {
          posted = `${Math.floor(diffDays / 7)} weeks ago`;
        } else {
          posted = date.toLocaleDateString();
        }
      }

      return {
        title: job.title || 'Untitled',
        company: job.company?.display_name || 'Unknown Company',
        location: job.location?.display_name || location,
        salary,
        description: job.description || '',
        url: job.redirect_url || '#',
        posted,
      };
    });

    return {
      provider: 'Adzuna',
      jobs,
      responseTime,
      count: data.count || 0,
      costPerSearch: ADZUNA_COST_PER_SEARCH,
    };
  } catch (error) {
    console.error('Adzuna error:', error);
    return {
      provider: 'Adzuna',
      jobs: [],
      responseTime: Date.now() - startTime,
      count: 0,
      costPerSearch: ADZUNA_COST_PER_SEARCH,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Search both APIs and return comparison data
 */
export async function searchJobs(params: SearchParams) {
  const [serpapi, adzuna] = await Promise.all([
    searchSerpAPI(params),
    searchAdzuna(params),
  ]);

  return {
    serpapi,
    adzuna,
    timestamp: new Date().toISOString(),
  };
}