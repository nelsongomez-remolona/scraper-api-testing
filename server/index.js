import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3001;
const SERPAPI_KEY = process.env.SERPAPI_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// SerpAPI job search endpoint
app.post('/api/search', async (req, res) => {
  try {
    const { what, where, limit = 20 } = req.body;

    if (!what || !where) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: what and where',
      });
    }

    if (!SERPAPI_KEY) {
      return res.status(500).json({
        success: false,
        error: 'SERPAPI_KEY not configured on server',
      });
    }

    // Build SerpAPI request
    const params = new URLSearchParams({
      engine: 'google_jobs',
      q: what,
      location: where,
      api_key: SERPAPI_KEY,
      num: limit.toString(),
    });

    const serpApiUrl = `https://serpapi.com/search?${params}`;

    console.log('Calling SerpAPI for:', what, 'in', where);

    const response = await fetch(serpApiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SerpAPI returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    // Check for API errors
    if (data.error) {
      return res.status(500).json({
        success: false,
        error: data.error,
      });
    }

    // Transform SerpAPI response to our format
    const jobs = (data.jobs_results || []).map(job => ({
      title: job.title,
      company: job.company_name,
      location: job.location,
      description: job.description || job.snippet || '',
      url: job.share_link || job.related_links?.[0]?.link || '',
      postedDate: job.detected_extensions?.posted_at || job.posted_at,
      salary: job.detected_extensions?.salary,
    }));

    res.json({
      success: true,
      jobs,
      total: jobs.length,
      count: jobs.length,
      searchInfo: data.search_metadata,
    });

  } catch (error) {
    console.error('SerpAPI error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch jobs from SerpAPI',
    });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'));

  app.get('*', (req, res) => {
    res.sendFile('index.html', { root: 'build' });
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/search`);
  console.log(`🔑 SerpAPI configured: ${SERPAPI_KEY ? 'Yes' : 'No'}`);
});
