/**
 * API Configuration
 * Environment variables are loaded from Railway
 */

export const API_CONFIG = {
  // Adzuna Configuration (FREE - 1,000 searches/month)
  // Get credentials from: https://developer.adzuna.com/
  // Set VITE_ADZUNA_APP_ID and VITE_ADZUNA_APP_KEY in Railway
  adzuna: {
    appId: import.meta.env.VITE_ADZUNA_APP_ID?.trim() || '0875fd8c',
    appKey: import.meta.env.VITE_ADZUNA_APP_KEY?.trim() || '918e6bced493a3b4a656e0bcf50dd6d4',
    enabled: true,
  },

  // SerpAPI Configuration (uses your Railway backend service)
  serpapi: {
    apiKey: import.meta.env.VITE_SERPAPI_KEY?.trim() || '',
    enabled: true,
  },
};
