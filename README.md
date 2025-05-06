# devirl-frontend

This is the repo for the dev-irl-frontend. On merge/push to main it will create/update AWS ECR image.

### In dev-quest-cdk repo to deploy

To manually deploy the service to the cluster and run on AWS ECS Fargate, you can run:

```
cdk deploy --all
```

## Setup

Make sure to install dependencies:

```bash
npm install
```

## Local Dev

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```
