# devirl-frontend

This is the repo for the dev-irl-frontend. On merge/push to main it will create/update AWS ECR image.

It is using Nuxt3 which is a Vue based fullstack framework. Some aspects of the app utilises it's built in server/backend capabilities such as auth calls and health routes.

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

## Run tests

```
npm run test

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

## Auth

Auth is handled via Auth0, Redis, Cookie sessions and Scala backend (dev-quest-service)

## Backend

### dev-quest-service

- Scala
- Typelevel
- FP heavy
- Weaver tests
- Auth
- CRUD Quests

This service in the future needs splitting out into auth and quests but for now leave for now.

The auth components could be split out to store the cookie session in Redis. Whilst the backend still calles Redis cache to allow access/use of authenticated backend routes such as CRUD quests.

## DB

Postgres via doobie for now

## CI/CD

Github actions
