# Build stage
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Run stage
FROM node:20-alpine AS runner

WORKDIR /app
COPY --from=builder /app ./

ENV NODE_ENV=production

# Install only prod deps (optional but good)
RUN npm install --omit=dev

EXPOSE 3000

# Start Next.js app in server mode
CMD ["npm", "run", "start"]
