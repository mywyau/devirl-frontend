# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

# Set for Nitro
ENV NODE_ENV=production
ENV NITRO_PRESET=node

# Only copy necessary runtime files
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json

# Optional: if you need runtime dependencies (e.g. Prisma, etc.)
# RUN npm install --omit=dev

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
