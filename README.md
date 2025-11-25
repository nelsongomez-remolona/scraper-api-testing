# Job API Comparison Tool

Compare SerpAPI vs Adzuna API for job search results side-by-side.

## Features

- **Side-by-side comparison** of SerpAPI and Adzuna job listings
- **Performance metrics** including response time and result count
- **Cost comparison** per search for each API
- **Clean UI** built with React, TypeScript, and Tailwind CSS

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, Node.js
- **APIs**: SerpAPI (Google Jobs), Adzuna API

## Local Development

### Prerequisites

- Node.js 18+ installed
- SerpAPI key (get from https://serpapi.com/)
- Adzuna credentials (get from https://developer.adzuna.com/)

### Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Add your API credentials to `.env`:
```env
VITE_ADZUNA_APP_ID=your_adzuna_app_id
VITE_ADZUNA_APP_KEY=your_adzuna_app_key
VITE_SERPAPI_KEY=your_serpapi_key
SERPAPI_KEY=your_serpapi_key
PORT=3001
```

4. Start the backend server (in one terminal):
```bash
npm run dev:server
```

5. Start the frontend dev server (in another terminal):
```bash
npm run dev
```

6. Open http://localhost:3000 in your browser

## Deployment to Railway

### Option 1: Deploy via Railway Dashboard

1. **Create a new Railway project**
   - Go to https://railway.app
   - Click "New Project" → "Deploy from GitHub repo"
   - Select this repository

2. **Configure Environment Variables**

   Add these variables in Railway settings:
   ```
   VITE_ADZUNA_APP_ID=your_adzuna_app_id
   VITE_ADZUNA_APP_KEY=your_adzuna_app_key
   VITE_SERPAPI_KEY=your_serpapi_key
   SERPAPI_KEY=your_serpapi_key
   NODE_ENV=production
   ```

3. **Configure Build & Start Commands**

   In Railway settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

4. **Deploy**

   Railway will automatically deploy your app. Once complete, you'll get a public URL.

### Option 2: Deploy via Railway CLI

1. **Install Railway CLI**:
```bash
npm install -g @railway/cli
```

2. **Login to Railway**:
```bash
railway login
```

3. **Initialize project**:
```bash
railway init
```

4. **Set environment variables**:
```bash
railway variables set SERPAPI_KEY=your_serpapi_key
railway variables set VITE_SERPAPI_KEY=your_serpapi_key
railway variables set VITE_ADZUNA_APP_ID=your_adzuna_app_id
railway variables set VITE_ADZUNA_APP_KEY=your_adzuna_app_key
railway variables set NODE_ENV=production
```

5. **Deploy**:
```bash
railway up
```

## API Credentials

### SerpAPI
- Free tier: 100 searches/month
- Sign up: https://serpapi.com/
- Cost: ~$0.01 per search (after free tier)

### Adzuna
- Free tier: 1,000 searches/month
- Sign up: https://developer.adzuna.com/
- Cost: Free (up to 1,000/month)

## Project Structure

```
├── server/              # Express backend
│   └── index.js        # API server with SerpAPI integration
├── src/
│   └── frontend/       # React frontend
│       ├── components/ # UI components
│       ├── config/     # API configuration
│       ├── lib/        # API client functions
│       └── types.ts    # TypeScript types
├── index.html          # Entry point
├── vite.config.ts      # Vite configuration
└── package.json        # Dependencies and scripts
```

## Scripts

- `npm run dev` - Start frontend development server
- `npm run dev:server` - Start backend API server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run preview` - Preview production build locally

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_ADZUNA_APP_ID` | Adzuna App ID (frontend) | Yes |
| `VITE_ADZUNA_APP_KEY` | Adzuna App Key (frontend) | Yes |
| `VITE_SERPAPI_KEY` | SerpAPI Key (frontend) | Optional |
| `SERPAPI_KEY` | SerpAPI Key (backend) | Yes |
| `PORT` | Server port | No (default: 3001) |
| `NODE_ENV` | Environment | No (default: development) |

## License

MIT
