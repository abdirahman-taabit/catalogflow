# Frontend guide

The frontend lives in `apps/web` and uses the Next.js App Router. Routes are thin page compositions; reusable workflow components live in `src/features`, shared product components live in `src/components`, and API/types/helpers live in `src/lib`.

## Data flow

SWR calls the functions in `src/lib/api.ts`. Those functions add `NEXT_PUBLIC_API_URL`, send a REST request, and turn non-success responses into `ApiRequestError`. Pages render a skeleton while loading, a retry state on failure, and the requested workflow when data arrives.

The catalog sends search, status, category, sorting, and pagination values to the backend. TanStack Table renders the returned rows on larger screens. A separate card layout renders the same data on mobile.

## Import form

React Hook Form owns the selected file and Zod checks file type and size. The backend remains the source of truth for CSV rows and duplicates. A completed response fills the validation summary and enables the rejection-report download.

## Product review

The detail route fetches the product and audit events. Generate, approve, and reject actions call explicit REST endpoints. Alert dialogs prevent accidental reviews, toasts report success/failure, and SWR refreshes product and audit data afterward.

## Visual system and accessibility

Tailwind tokens in `globals.css` reproduce the approved graphite, stone, and moss design. shadcn/ui supplies accessible behavior, then local classes provide the exact visual direction. Interactive controls have visible focus rings, icon-only buttons have names, fields use labels, and mobile navigation stays reachable at the bottom of the viewport.

Run `npm test` for component tests and `npm run test:e2e` for the Chrome journey.
