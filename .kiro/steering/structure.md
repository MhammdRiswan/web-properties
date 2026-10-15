# Project Structure

## Root Layout

```
src/
├── app/                        # Next.js App Router pages
├── components/                 # React components
├── hooks/                      # Custom React hooks
├── lib/                        # Utilities, API client, constants
├── store/                      # Zustand global state stores
├── types/                      # TypeScript type definitions
├── styles/                     # Global CSS
└── mocks/                      # MSW mock data and handlers
```

## App Router (`src/app/`)

```
app/
├── layout.tsx                  # Root layout — Header, Footer, Providers, ErrorBoundary
├── page.tsx                    # Home page — hero, featured properties, CTA
├── properties/
│   ├── page.tsx                # Property listing — search, filter, sort, grid
│   └── [id]/
│       └── page.tsx            # Property detail — gallery, map, contact form
├── favorites/
│   └── page.tsx                # Saved favorites
└── contact/
    └── page.tsx                # Standalone contact page
```

## Components (`src/components/`)

Follows **Atomic Design** (atoms → molecules → organisms):

```
components/
├── ui/                         # Base atoms: Button, Input, Modal, Skeleton, Badge
├── layout/                     # Header, Navigation, Footer, MobileMenu
├── property/                   # PropertyCard, PropertyGrid, PropertyDetail,
│                               #   ImageGallery, PropertyMap
├── search/                     # SearchBar, FilterPanel, FilterDrawer, SortDropdown
└── forms/                      # ContactForm, FormField
```

## Hooks (`src/hooks/`)

| File | Purpose |
|---|---|
| `useProperties.ts` | TanStack Query infinite fetch with filters/search/sort |
| `useFilters.ts` | Wrapper for useFilterStore with `activeFilterCount` |
| `useFavorites.ts` | Read/write favorites from Zustand store |
| `useInfiniteScroll.ts` | IntersectionObserver-based load-more trigger |
| `useMediaQuery.ts` | Responsive breakpoint detection |
| `useSearch.ts` | Debounced search query state |

## State Stores (`src/store/`)

| File | Manages |
|---|---|
| `useFavoriteStore.ts` | Favorite property IDs, persisted to localStorage |
| `useFilterStore.ts` | Active filters, sort option, synced with URL query params |

## Types (`src/types/`)

| File | Contains |
|---|---|
| `property.ts` | `Property`, `PropertyImage`, `PropertyType` |
| `filter.ts` | `PropertyFilters`, `FilterCounts`, `SortOption`, `SortConfig` |
| `api.ts` | `PaginatedResponse`, `ApiResponse`, `SearchResponse` |

## Lib (`src/lib/`)

```
lib/
├── api/
│   ├── client.ts               # Fetch wrapper with error handling and retry logic
│   └── endpoints.ts            # API endpoint constants
├── utils/
│   ├── formatters.ts           # formatPrice, formatArea, formatDate
│   ├── validators.ts           # Email, phone validation helpers
│   └── helpers.ts              # isNewProperty, buildQueryParams
└── constants/
    └── index.ts                # SORT_OPTIONS, ERROR_MESSAGES, breakpoints
```

## Mocks (`src/mocks/`)

```
mocks/
├── browser.ts                  # MSW browser service worker setup
├── server.ts                   # MSW Node server for tests
├── handlers.ts                 # Request handlers for /api/properties, /api/contact
└── data/
    └── properties.ts           # Static mock property data (min. 20 items)
```

## Conventions

- **File naming**: PascalCase for components (`PropertyCard.tsx`), camelCase for hooks/utils (`useFilters.ts`)
- **Component exports**: named exports preferred; default export only for Next.js pages
- **Co-location**: keep component-specific types inline; shared types go in `src/types/`
- **Responsive classes**: always mobile-first — base styles for mobile, `md:` for tablet, `lg:` for desktop
- **Breakpoints**: mobile `< 768px`, tablet `768px–1024px`, desktop `> 1024px`
- **Accessibility**: every interactive element needs an `aria-label` or visible text label; use semantic HTML throughout
- **Animations**: all motion via Framer Motion — no raw CSS transitions for interactive elements
- **Images**: always use Next.js `<Image>` — never `<img>` tags
- **Maps**: always dynamically import React Leaflet (`next/dynamic` with `ssr: false`)
