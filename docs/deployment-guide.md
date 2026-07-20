# Deployment guide

## GitHub Actions

Every push to `main` and every pull request runs `.github/workflows/ci.yml`. The frontend job installs locked dependencies, lints, typechecks, tests, audits, and builds. The backend job installs Java 21 and runs the Maven wrapper through `verify`, including the PostgreSQL Testcontainers test when Docker is available. A repository job checks whitespace and common credential signatures.

## Render

`render.yaml` defines the Spring Boot Docker service and PostgreSQL database. The production profile builds a JDBC URL from Render's private database fields. Set `CORS_ALLOWED_ORIGINS` to the exact Vercel production origin. Render checks `/api/health`, which performs a database query before reporting `UP`.

## Vercel

Import the GitHub repository, select `apps/web` as the project root, and set `NEXT_PUBLIC_API_URL` to the public Render API origin without a trailing slash. Next.js embeds this public value during the production build.

## Verification order

1. Confirm the Render health endpoint returns application and database `UP`.
2. Confirm the Vercel landing page and a refreshed nested route load.
3. Upload `sample-data/catalogflow-sample.csv`.
4. Search for an incomplete product, generate a suggestion, and approve it.
5. Confirm the product changes and the audit timeline adds the approval.
6. Repeat the layout check at a 390px-wide Chrome viewport.
7. Confirm Chrome has no console errors and Render has no unresolved error logs.

Secrets belong only in the deployment platform. `.env.example` documents names but never contains production values.
