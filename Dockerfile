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


# 890742562318

# docker build -t dev-irl-frontend .
# docker tag dev-irl-frontend:latest 890742562318.dkr.ecr.eu-west-2.amazonaws.com/dev-irl-frontend:latest
# docker push 890742562318.dkr.ecr.eu-west-2.amazonaws.com/dev-irl-frontend:latest
