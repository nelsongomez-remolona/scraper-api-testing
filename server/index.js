// ULTRA-MINIMAL test version - if this doesn't log, Railway has a bigger problem
console.log('========================================');
console.log('🚀 STARTUP: Node is running!');
console.log('========================================');

// Force flush stdout
process.stdout.write('STDOUT: Process starting...\n');
process.stderr.write('STDERR: Process starting...\n');

// Add error handling FIRST
process.on('uncaughtException', (error) => {
  console.error('========================================');
  console.error('❌ UNCAUGHT EXCEPTION:');
  console.error(error);
  console.error('========================================');
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('========================================');
  console.error('❌ UNHANDLED REJECTION:');
  console.error(reason);
  console.error('========================================');
  process.exit(1);
});

console.log('Loading express...');
const express = require('express');
const path = require('path');
console.log('✅ Express loaded');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from dist folder (frontend)
// Note: server is in server/ directory, dist is in parent directory
app.use(express.static(path.join(__dirname, '../dist')));

// Health check
app.get('/health', (req, res) => {
  console.log('Health check called');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Simple test endpoint
app.get('/test', (req, res) => {
  console.log('Test endpoint called');
  res.json({ 
    message: 'Server is working!',
    env: {
      hasSerpApi: !!process.env.SERPAPI_KEY,
      hasSpreadsheetId: !!process.env.SPREADSHEET_ID,
      hasGoogleCreds: !!process.env.GOOGLE_CREDENTIALS
    }
  });
});

// Test scraper module loading
app.get('/test-scraper', (req, res) => {
  try {
    console.log('Testing scraper module load...');
    const scraperModule = require('./scraper');
    console.log('✅ Scraper module loaded!');
    console.log('Available exports:', Object.keys(scraperModule));
    res.json({
      success: true,
      exports: Object.keys(scraperModule),
      hasRunJobScraper: !!scraperModule.runJobScraper,
      hasRunGeneralJobScraper: !!scraperModule.runGeneralJobScraper
    });
  } catch (error) {
    console.error('❌ Failed to load scraper module:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// Scraper endpoints - load modules only when called
app.post('/api/scrape', async (req, res) => {
  try {
    console.log('=== /api/scrape endpoint called ===');
    console.log('Loading scraper module...');
    const scraperModule = require('./scraper');
    console.log('Scraper module loaded successfully');
    console.log('Available exports:', Object.keys(scraperModule));
    
    if (!scraperModule.runJobScraper) {
      throw new Error('runJobScraper function not found in scraper module!');
    }
    
    console.log('Executing runJobScraper...');
    const result = await scraperModule.runJobScraper();
    console.log('Scraper completed successfully');
    res.json(result);
  } catch (error) {
    console.error('❌ Error in /api/scrape:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

app.post('/api/scrape/general', async (req, res) => {
  try {
    console.log('=== /api/scrape/general endpoint called ===');
    console.log('Loading scraper module...');
    const scraperModule = require('./scraper');
    console.log('Scraper module loaded successfully');
    console.log('Available exports:', Object.keys(scraperModule));
    
    if (!scraperModule.runGeneralJobScraper) {
      throw new Error('runGeneralJobScraper function not found in scraper module!');
    }
    
    console.log('Executing runGeneralJobScraper...');
    const result = await scraperModule.runGeneralJobScraper();
    console.log('General scraper completed successfully');
    res.json(result);
  } catch (error) {
    console.error('❌ Error in /api/scrape/general:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// API Comparison Tool endpoints
app.post('/api/search', async (req, res) => {
  try {
    console.log('=== /api/search endpoint called ===');
    const { what, where, limit = 20 } = req.body;
    
    if (!what || !where) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: what and where'
      });
    }

    // Use SerpAPI to search for jobs
    const { getJson } = require('serpapi');
    const query = `${what} ${where}`;
    
    const params = {
      engine: 'google',
      q: query + ' (site:boards.greenhouse.io OR site:jobs.lever.co OR site:jobs.ashbyhq.com OR site:linkedin.com/jobs)',
      api_key: process.env.SERPAPI_KEY,
      tbs: 'qdr:m',
      num: Math.min(limit, 50),
      hl: 'en',
      gl: 'us',
      device: 'desktop'
    };

    const response = await getJson(params);
    
    const jobs = (response.organic_results || []).map(result => ({
      title: result.title || 'Untitled',
      company: result.displayed_link || 'Unknown',
      location: where,
      description: result.snippet || '',
      url: result.link || '#',
      postedDate: result.date || undefined
    }));

    res.json({
      success: true,
      jobs,
      total: response.search_information?.total_results || jobs.length,
      count: jobs.length
    });

  } catch (error) {
    console.error('❌ Error in /api/search:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

console.log('Starting server...');
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('========================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Binding to 0.0.0.0:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET  /health');
  console.log('  GET  /test');
  console.log('  GET  /test-scraper');
  console.log('  POST /api/scrape');
  console.log('  POST /api/scrape/general');
  console.log('  POST /api/search');
  console.log('  Frontend: / (static files from dist/)');
  console.log('========================================');
});

server.on('error', (error) => {
  console.error('========================================');
  console.error('❌ SERVER ERROR:');
  console.error(error);
  console.error('========================================');
  process.exit(1);
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});