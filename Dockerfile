# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only the built output
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json

# Install only production dependencies (don't reuse node_modules)
RUN npm install --omit=dev

ENV NODE_ENV=production
ENV NITRO_PRESET=node
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
