# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/web ./apps/web
COPY packages/shared ./packages/shared

# Build shared package first
RUN cd packages/shared && npm run build

# Build frontend
RUN cd apps/web && npm run build

# Production stage
FROM node:18-alpine AS runner

# Install production dependencies
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy built frontend from builder stage
COPY --from=builder /app/apps/web/dist ./dist

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"]