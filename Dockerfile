# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (uses cache better)
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the source files
COPY . .

# Build the app
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine AS runner

WORKDIR /app

# Copy production output and package.json
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json

# Install only production dependencies
RUN npm install --omit=dev

# Runtime env
ENV NODE_ENV=production
ENV NITRO_PRESET=node
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
