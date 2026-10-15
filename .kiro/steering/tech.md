# Tech Stack

## Framework & Language

- **Next.js 14+** (App Router) with **TypeScript**
- **React 18+** for component-based UI

## Styling & Animation

- **Tailwind CSS** — utility-first styling, responsive breakpoints via `sm:`, `md:`, `lg:` prefixes
- **Framer Motion** — entrance animations, hover effects, drawer/menu transitions
- **Font**: sans-serif consistently across the entire UI — set via `font-sans` in Tailwind (configured in `globals.css` on the `<html>` or `<body>` element)

## State Management & Data Fetching

- **TanStack Query (React Query)** — server state, infinite pagination, caching (stale-while-revalidate)
- **Zustand** — client state for filters and favorites, with localStorage persistence

## Forms & Validation

- **React Hook Form** — form state and submission
- **Zod** — schema validation for form inputs

## UI Primitives

- **Headless UI** or **Radix UI** — accessible component primitives (modals, dropdowns)

## Maps

- **React Leaflet** (wrapping **Leaflet**) — dynamically imported to avoid SSR issues

## Image Handling

- **Next.js `<Image>`** component — lazy loading, blur placeholder, WebP/AVIF optimization
- **Sharp** — server-side image processing

## API Mocking

- **MSW (Mock Service Worker)** — intercepts API calls in browser and test environments
  - Browser worker: `src/mocks/browser.ts`
  - Server handler: `src/mocks/server.ts`
  - Handlers: `src/mocks/handlers.ts`

## Testing

- **Vitest** — unit and component test runner
- **React Testing Library** — component behavior testing
- **Playwright** — E2E tests (requires dev server at `http://localhost:3000`)
- **jest-axe** or **@axe-core/react** — automated accessibility testing
- **MSW** — API mocking in tests

## Code Quality

- **ESLint** + **Prettier** — linting and formatting
- **Husky** — pre-commit hooks

## Common Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Build & Production
npm run build        # Production build
npm run start        # Start production server

# Testing
npx vitest --run     # Run unit/component tests once (no watch mode)
npx vitest           # Run tests in watch mode
npx playwright test  # Run E2E tests (requires running dev server)

# Code Quality
npm run lint         # Run ESLint
npm run format       # Run Prettier
```

## Typography

- Font family: **sans-serif** consistently across all UI elements
- Apply via Tailwind's `font-sans` class or set as the base `font-family` in `globals.css`
- No serif or monospace fonts in the UI (monospace only acceptable in code/debug contexts)

## Browser Support

- Chrome/Edge, Firefox, Safari — last 2 versions
- Mobile Safari iOS 13+, Chrome Mobile — last 2 versions
