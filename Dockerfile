# Use official Node.js image
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Serve with a lightweight HTTP server
FROM node:20-alpine AS runner
WORKDIR /app

# Install only prod deps
COPY --from=builder /app ./

RUN npm install -g serve
CMD ["serve", "-s", "out"]

# If you're using Next.js, you may use "next start" instead
EXPOSE 3000

