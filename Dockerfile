FROM node:22-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build frontend
RUN npm run build

# Expose port (Railway sets PORT env var)
EXPOSE 8080

# Start server
CMD ["node", "server/index.js"]
