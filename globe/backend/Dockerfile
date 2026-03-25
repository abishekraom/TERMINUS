# syntax=docker/dockerfile:1
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies first (layer cached separately)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY src/ ./src/

# Secrets directory is mounted at runtime via Docker volume
# (never baked into image)
RUN mkdir -p /app/secrets /app/data

# Non-root user for security
RUN addgroup -S vdie && adduser -S vdie -G vdie
RUN chown -R vdie:vdie /app
USER vdie

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3001/health || exit 1

CMD ["node", "src/index.js"]
