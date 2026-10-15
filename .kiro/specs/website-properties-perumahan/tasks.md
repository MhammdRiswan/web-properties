# Implementation Plan: Website Properties Perumahan

## Overview

Implementasi platform frontend properti perumahan menggunakan Next.js 14+ dengan TypeScript. Pendekatan incremental: mulai dari fondasi (types, mock data, layout), lalu fitur inti (listing, search, filter), kemudian fitur detail (gallery, map, contact), dan diakhiri dengan fitur pendukung (favorites, sorting, accessibility).

## Tasks

- [x] 1. Setup project foundation — types, constants, dan mock data
  - Buat TypeScript interfaces di `src/types/property.ts`, `src/types/filter.ts`, dan `src/types/api.ts` sesuai data models di design
  - Buat constants di `src/lib/constants/index.ts` (SORT_OPTIONS, ERROR_MESSAGES, breakpoints)
  - Buat utility functions di `src/lib/utils/formatters.ts` (formatPrice, formatArea, formatDate) dan `src/lib/utils/helpers.ts` (isNewProperty, buildQueryParams)
  - Buat mock data properti (minimal 20 item) di `src/mocks/data/properties.ts`
  - Setup MSW handlers di `src/mocks/handlers.ts` untuk endpoint `/api/properties` dan `/api/properties/[id]`
  - Setup MSW browser worker di `src/mocks/browser.ts` dan server di `src/mocks/server.ts`
  - _Requirements: 1.1, 1.2, 2.3, 4.3_

- [x] 2. Setup global state stores dan custom hooks dasar
  - [x] 2.1 Buat Zustand store untuk favorites di `src/store/useFavoriteStore.ts`
    - Implementasi state: `favorites: string[]`, actions: `toggleFavorite`, `isFavorite`, `clearFavorites`
    - Implementasi persistence ke localStorage dengan versioning (`FavoritesStorage` model)
    - _Requirements: 11.2, 11.3, 11.6_

  - [ ]* 2.2 Tulis unit tests untuk useFavoriteStore
    - Test: toggleFavorite menambah/menghapus ID dari array
    - Test: isFavorite mengembalikan nilai yang benar
    - Test: persistence ke localStorage berfungsi
    - _Requirements: 11.2, 11.6_

  - [x] 2.3 Buat Zustand store untuk filters di `src/store/useFilterStore.ts`
    - Implementasi state: `filters: PropertyFilters`, `sortBy: SortOption`, actions: `setFilter`, `resetFilters`, `setSortBy`
    - Sinkronisasi dengan URL query params
    - _Requirements: 3.1–3.5, 10.3_

  - [x] 2.4 Buat custom hooks dasar di `src/hooks/`
    - `useMediaQuery.ts`: hook untuk responsive breakpoint detection
    - `useInfiniteScroll.ts`: hook dengan IntersectionObserver untuk infinite scroll
    - `useFilters.ts`: wrapper hook untuk useFilterStore dengan `activeFilterCount`
    - _Requirements: 1.3, 7.1, 7.4–7.6_

  - [ ]* 2.5 Tulis unit tests untuk custom hooks
    - Test: useMediaQuery mengembalikan nilai boolean yang benar
    - Test: useFilters.resetFilters mengosongkan semua filter
    - Test: useFilters.activeFilterCount menghitung filter aktif dengan benar
    - _Requirements: 7.1, 3.8_

- [x] 3. Setup API client dan useProperties hook
  - [x] 3.1 Buat API client di `src/lib/api/client.ts` dan `src/lib/api/endpoints.ts`
    - Implementasi fetch wrapper dengan error handling (NetworkError, ApiError, NotFound)
    - Implementasi retry logic dengan exponential backoff untuk 5xx errors
    - _Requirements: 9.1, 9.5_

  - [x] 3.2 Buat `useProperties` hook di `src/hooks/useProperties.ts`
    - Gunakan TanStack Query `useInfiniteQuery` untuk pagination
    - Terima options: `filters`, `searchQuery`, `sortBy`, `limit`
    - Return: `properties`, `isLoading`, `isError`, `hasMore`, `fetchNextPage`, `isFetchingNextPage`
    - _Requirements: 1.1, 1.3, 2.2, 3.6, 10.2_

  - [ ]* 3.3 Tulis integration tests untuk useProperties hook
    - Test: hook mengembalikan data properti dari MSW mock
    - Test: hook memanggil fetchNextPage saat infinite scroll trigger
    - Test: hook menerapkan filter dan search query ke API call
    - _Requirements: 1.1, 1.3, 3.6_

- [x] 4. Checkpoint — Pastikan semua tests lulus, tanya user jika ada pertanyaan.

- [ ] 5. Implementasi base UI components
  - [x] 5.1 Buat base UI components di `src/components/ui/`
    - `Button.tsx`: variants (primary, secondary, ghost), sizes, loading state, accessible
    - `Input.tsx`: dengan label, error message, dan ARIA attributes
    - `Skeleton.tsx`: animated skeleton untuk loading states (card, text, image variants)
    - `Modal.tsx`: accessible modal dengan focus trap, ESC close, backdrop click close
    - `Badge.tsx`: untuk label "Baru" dan favorite count
    - _Requirements: 6.4, 9.2, 12.2, 12.3, 12.5_

  - [ ]* 5.2 Tulis component tests untuk base UI components
    - Test: Button renders dengan variant yang benar dan memanggil onClick
    - Test: Input menampilkan error message saat prop error diberikan
    - Test: Modal menutup saat ESC ditekan
    - Test: Skeleton renders dengan jumlah item yang benar
    - _Requirements: 12.2, 12.3_

- [ ] 6. Implementasi Layout components (Header, Navigation, Footer)
  - [x] 6.1 Buat `src/components/layout/Navigation.tsx`
    - Sticky positioning dengan `position: sticky` atau scroll listener
    - Link ke: Home, Cari Properti, Tentang Kami, Kontak
    - Active link highlighting berdasarkan current pathname
    - Logo yang navigasi ke home
    - Favorite badge dengan count dari useFavoriteStore
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 11.4_

  - [x] 6.2 Buat `src/components/layout/MobileMenu.tsx`
    - Hamburger icon toggle
    - Framer Motion animation untuk open/close (slide-in dari kanan atau fade)
    - Menutup saat link diklik atau backdrop diklik
    - _Requirements: 7.2, 8.5_

  - [x] 6.3 Buat `src/components/layout/Header.tsx` dan `Footer.tsx`
    - Header mengintegrasikan Navigation dan MobileMenu
    - Footer dengan informasi website
    - Semantic HTML: `<header>`, `<nav>`, `<footer>`
    - _Requirements: 8.1, 12.4_

  - [x] 6.4 Setup root layout di `src/app/layout.tsx`
    - Integrasikan Header dan Footer
    - Setup React Query Provider dan MSW initialization
    - Setup global error boundary
    - _Requirements: 8.1, 9.5_

  - [ ]* 6.5 Tulis component tests untuk Navigation
    - Test: active link mendapat highlight class yang benar
    - Test: favorite badge menampilkan count yang benar
    - Test: hamburger menu toggle membuka/menutup MobileMenu
    - _Requirements: 8.2, 8.3, 11.4_

- [x] 6.5. Implementasi Splash Screen component
  - [x] 6.5.1 Buat `src/hooks/useSplashScreen.ts`
    - Implementasi state management untuk splash screen visibility, loading progress, dan user interactions
    - Handle auto-hide timer (5 detik default), ESC key untuk skip
    - Optional localStorage check untuk skip pada revisit
    - Preload critical resources (images, fonts) dengan progress tracking
    - Return: `isVisible`, `isLoading`, `progress`, `handleStart`, `handleSkip`
    - _Requirements: 12.1, 12.7, 12.8_

  - [x] 6.5.2 Buat `src/components/layout/SplashScreen.tsx`
    - Fullscreen overlay dengan high z-index dan prevent scroll
    - Tampilkan logo website, title "Website Properties Perumahan", tagline "Temukan Rumah Impian Anda"
    - Tombol "Mulai" yang prominent dan accessible dengan focus management
    - Loading indicator/progress bar untuk resource preloading
    - Background menarik (gradient atau property image)
    - Framer Motion animations: logo fade-in + scale, text stagger, button bounce, smooth exit (800ms)
    - Responsive design untuk mobile/tablet/desktop
    - Keyboard accessible (ESC key, focus pada tombol "Mulai")
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.9, 12.10_

  - [x] 6.5.3 Integrasikan SplashScreen ke root layout
    - Update `src/app/layout.tsx` untuk include SplashScreen component
    - Implementasi conditional rendering berdasarkan `useSplashScreen` state
    - Preload konten utama di background saat splash screen aktif
    - Smooth transition dari splash screen ke main content
    - _Requirements: 12.1, 12.7_

  - [ ]* 6.5.4 Tulis component tests untuk SplashScreen
    - Test: SplashScreen renders dengan logo, title, tagline, dan tombol "Mulai"
    - Test: tombol "Mulai" memanggil handleStart callback
    - Test: ESC key memanggil handleSkip callback
    - Test: auto-hide setelah 5 detik jika tidak ada interaksi
    - Test: loading progress updates dari 0 ke 100%
    - Test: keyboard focus pada tombol "Mulai" saat component mount
    - Test: responsive design pada mobile, tablet, desktop breakpoints
    - _Requirements: 12.3, 12.4, 12.8, 12.10_

  - [ ]* 6.5.5 Tulis animation tests untuk SplashScreen
    - Test: entrance animations timing (logo → text → button sequence)
    - Test: exit animation duration (800ms max)
    - Test: smooth transition effects dengan Framer Motion
    - _Requirements: 12.4, 12.9_

- [x] 7. Implementasi PropertyCard component
  - [x] 7.1 Buat `src/components/property/PropertyCard.tsx`
    - Tampilkan: foto utama (Next.js Image dengan blur placeholder), harga (formatted), lokasi, bedrooms, bathrooms, luas tanah
    - Badge "Baru" untuk properti `isNew === true` (< 7 hari dari `createdAt`)
    - Heart icon button untuk favorite toggle dengan filled/outline state
    - Hover effect dengan Framer Motion (scale + shadow)
    - Click navigasi ke `/properties/[id]`
    - ARIA label untuk heart button dan image alt text
    - _Requirements: 1.2, 1.4, 1.5, 11.1, 11.3, 12.1, 12.5_

  - [ ]* 7.2 Tulis component tests untuk PropertyCard
    - Test: menampilkan badge "Baru" untuk properti < 7 hari
    - Test: tidak menampilkan badge "Baru" untuk properti > 7 hari
    - Test: memanggil onFavoriteToggle dengan ID yang benar saat heart diklik
    - Test: heart icon filled saat `isFavorite === true`
    - Test: image memiliki alt text yang deskriptif
    - _Requirements: 1.2, 1.4, 11.1, 11.3, 12.1_

- [x] 8. Implementasi PropertyGrid component dengan infinite scroll
  - [x] 8.1 Buat `src/components/property/PropertyGrid.tsx`
    - Responsive grid: 1 kolom mobile, 2 kolom tablet, 3-4 kolom desktop (Tailwind grid)
    - Render skeleton cards saat `isLoading === true`
    - Stagger entrance animation dengan Framer Motion saat cards muncul
    - Integrasikan `useInfiniteScroll` hook untuk auto-load saat scroll ke bawah
    - Empty state component saat `properties.length === 0`
    - _Requirements: 1.1, 1.3, 7.4, 7.5, 7.6, 9.2_

  - [ ]* 8.2 Tulis component tests untuk PropertyGrid
    - Test: renders skeleton saat isLoading true
    - Test: renders empty state saat properties array kosong
    - Test: renders correct number of PropertyCard components
    - Test: memanggil onLoadMore saat sentinel element terlihat
    - _Requirements: 1.1, 9.2_

- [x] 9. Implementasi Search dan Filter components
  - [x] 9.1 Buat `src/components/search/SearchBar.tsx`
    - Debounce input 500ms sebelum trigger onSearch
    - Minimum 3 karakter untuk trigger search
    - Clear button (X) saat ada input
    - Loading indicator saat searching
    - Keyboard accessible (role="searchbox", ARIA attributes)
    - _Requirements: 2.1, 2.2, 12.2_

  - [x] 9.2 Buat `src/components/search/FilterPanel.tsx`
    - Filter: rentang harga (min/max number inputs), bedrooms (1-5+ checkboxes), bathrooms (1-4+ checkboxes), luas tanah (min/max), tipe properti (Rumah/Townhouse/Villa checkboxes)
    - Tampilkan available count per filter option
    - Tombol "Reset Filter" yang clear semua filters
    - Debounce filter changes 300ms sebelum apply
    - _Requirements: 3.1–3.8_

  - [x] 9.3 Buat `src/components/search/FilterDrawer.tsx` untuk mobile
    - Wrap FilterPanel dalam drawer yang slide dari bawah/kiri
    - Framer Motion animation untuk open/close
    - Overlay backdrop
    - _Requirements: 7.3_

  - [x] 9.4 Buat `src/components/search/SortDropdown.tsx`
    - Dropdown dengan opsi: Terbaru, Harga Terendah, Harga Tertinggi, Luas Terbesar
    - Tampilkan active sort indicator
    - Accessible dropdown dengan keyboard navigation
    - _Requirements: 10.1, 10.4_

  - [ ]* 9.5 Tulis integration tests untuk Search dan Filter
    - Test: SearchBar memanggil onSearch setelah 500ms debounce dengan minimal 3 karakter
    - Test: SearchBar tidak memanggil onSearch untuk input < 3 karakter
    - Test: FilterPanel memanggil onFilterChange saat filter berubah
    - Test: Reset button mengosongkan semua filter values
    - Test: SortDropdown memanggil onSortChange dengan nilai yang benar
    - _Requirements: 2.1, 2.2, 3.6, 3.8, 10.1_

- [x] 10. Implementasi halaman Property Listing (`/properties`)
  - [x] 10.1 Buat `src/app/properties/page.tsx`
    - Integrasikan SearchBar, FilterPanel/FilterDrawer, SortDropdown, dan PropertyGrid
    - Gunakan `useProperties` hook dengan filters dan searchQuery dari stores
    - Tampilkan jumlah hasil pencarian (Requirements 2.5)
    - Tampilkan pesan "Tidak ada properti yang sesuai" saat empty results (Requirements 2.4)
    - Tampilkan FilterPanel sebagai sidebar di desktop, FilterDrawer di mobile
    - _Requirements: 1.1, 2.4, 2.5, 3.6, 7.3, 10.3_

  - [ ]* 10.2 Tulis integration tests untuk Property Listing page
    - Test: halaman menampilkan PropertyGrid dengan data dari MSW mock
    - Test: search input memperbarui property list
    - Test: filter changes memperbarui property list
    - Test: sort selection memperbarui urutan property list
    - Test: empty state ditampilkan saat tidak ada hasil
    - _Requirements: 1.1, 2.4, 3.6, 10.2_

- [x] 11. Checkpoint — Pastikan semua tests lulus, tanya user jika ada pertanyaan.

- [x] 12. Implementasi ImageGallery component
  - [x] 12.1 Buat `src/components/property/ImageGallery.tsx`
    - Main image besar dengan Next.js Image (priority untuk first image)
    - Thumbnail strip di bawah main image
    - Klik thumbnail → ganti main image dengan transisi 200ms (Framer Motion)
    - Tombol previous/next untuk navigasi antar foto
    - Image counter "X / Y" di overlay main image
    - Lazy load thumbnails (Next.js Image dengan loading="lazy")
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.7, 9.3_

  - [x] 12.2 Buat lightbox fullscreen di dalam ImageGallery
    - Klik main image → buka lightbox (fullscreen overlay)
    - Keyboard navigation: ArrowLeft/ArrowRight untuk navigasi, ESC untuk tutup
    - Tombol close (X) visible
    - Touch swipe support untuk mobile (touch event handlers)
    - Focus trap saat lightbox aktif
    - _Requirements: 5.5, 5.6, 12.2_

  - [ ]* 12.3 Tulis component tests untuk ImageGallery
    - Test: klik thumbnail memperbarui main image
    - Test: image counter menampilkan posisi yang benar
    - Test: klik main image membuka lightbox
    - Test: ESC key menutup lightbox
    - Test: ArrowRight/ArrowLeft navigasi antar foto di lightbox
    - _Requirements: 5.3, 5.5, 5.6, 5.7_

- [x] 13. Implementasi PropertyMap component
  - [x] 13.1 Buat `src/components/property/PropertyMap.tsx`
    - Dynamic import React Leaflet (lazy load untuk performa)
    - Render map dengan marker di koordinat properti
    - Zoom controls
    - Fallback UI saat map gagal load
    - _Requirements: 4.5, 9.1_

- [x] 14. Implementasi ContactForm component
  - [x] 14.1 Buat `src/components/forms/ContactForm.tsx`
    - Fields: nama lengkap, nomor telepon, email, pesan
    - Gunakan React Hook Form + Zod schema validation
    - Validasi: nama (required, min 3 char), telepon (required, min 12 digit, format +62/08), email (required, valid format), pesan (required, min 10 char)
    - Real-time validation on blur
    - Error messages di bawah setiap field yang invalid
    - Disable submit button saat submitting atau ada validation errors
    - Label-input association dengan `htmlFor`/`id` (accessibility)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 12.6_

  - [x] 14.2 Integrasikan form submission dengan MSW mock
    - POST ke `/api/contact` via API client
    - Success: tampilkan alert/toast "Pesan Anda telah terkirim. Agen akan menghubungi Anda segera"
    - Error: tampilkan alert/toast "Gagal mengirim pesan. Silakan coba lagi"
    - Clear form setelah sukses
    - _Requirements: 6.6, 6.7_

  - [ ]* 14.3 Tulis unit dan component tests untuk ContactForm
    - Unit Test: Zod schema validasi email format yang benar dan salah
    - Unit Test: Zod schema validasi phone format (+62 dan 08 prefix)
    - Test: form menampilkan error message untuk field yang invalid
    - Test: submit button disabled saat form invalid
    - Test: success message muncul setelah submit berhasil (MSW mock)
    - Test: form di-clear setelah submit berhasil
    - Test: semua inputs memiliki label yang terasosiasi
    - _Requirements: 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 12.6_

- [x] 15. Implementasi PropertyDetail page
  - [x] 15.1 Buat `src/app/properties/[id]/page.tsx`
    - Fetch data properti berdasarkan ID menggunakan React Query
    - Integrasikan ImageGallery, PropertyMap, ContactForm (dalam Modal)
    - Tampilkan semua informasi: harga, lokasi lengkap, luas tanah, luas bangunan, bedrooms, bathrooms, lantai, tahun dibangun, deskripsi, fasilitas
    - Tombol "Hubungi Agen" yang membuka Modal berisi ContactForm
    - Share buttons: WhatsApp, Facebook, Twitter (dengan URL yang benar)
    - Skeleton loading saat data sedang di-fetch
    - 404 handling saat properti tidak ditemukan
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 9.2_

  - [ ]* 15.2 Tulis component tests untuk PropertyDetail page
    - Test: semua informasi properti ditampilkan dengan benar
    - Test: klik "Hubungi Agen" membuka modal ContactForm
    - Test: share buttons memiliki URL yang benar
    - Test: skeleton ditampilkan saat loading
    - _Requirements: 4.1, 4.3, 4.6, 4.7, 9.2_

- [x] 16. Implementasi Favorites page dan integrasi wishlist
  - [x] 16.1 Buat `src/app/favorites/page.tsx`
    - Ambil favorite property IDs dari useFavoriteStore
    - Fetch data properti untuk setiap ID yang difavoritkan
    - Tampilkan PropertyGrid dengan properti favorit
    - Empty state saat belum ada favorit
    - _Requirements: 11.5_

  - [x] 16.2 Integrasikan useFavoriteStore ke PropertyCard dan Navigation
    - PropertyCard: heart icon toggle memanggil `toggleFavorite` dari store
    - Navigation: badge count dari `favoriteCount` di store
    - Pastikan state persists setelah page reload (localStorage)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.6_

  - [ ]* 16.3 Tulis integration tests untuk Favorites feature
    - Test: klik heart di PropertyCard menambah properti ke favorites
    - Test: klik heart kedua kali menghapus properti dari favorites
    - Test: Navigation badge count update saat favorites berubah
    - Test: Favorites page menampilkan properti yang difavoritkan
    - Test: favorites persist setelah simulasi page reload (localStorage mock)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

- [x] 17. Checkpoint — Pastikan semua tests lulus, tanya user jika ada pertanyaan.

- [x] 18. Implementasi Home page dan routing
  - [x] 18.1 Buat `src/app/page.tsx` (Home page)
    - Hero section dengan search bar prominent
    - Featured properties section (PropertyGrid dengan limit 6-8)
    - CTA section menuju halaman Cari Properti
    - Framer Motion entrance animations untuk sections
    - _Requirements: 1.1, 1.5_

  - [x] 18.2 Buat `src/app/contact/page.tsx`
    - Standalone contact page dengan ContactForm
    - Informasi kontak tambahan
    - _Requirements: 6.1_

- [x] 19. Implementasi performance optimizations
  - [x] 19.1 Optimasi image loading
    - Pastikan semua Next.js Image components menggunakan `sizes` prop yang tepat
    - Tambahkan `blurDataURL` placeholder untuk semua property images
    - Verifikasi lazy loading aktif untuk images di bawah fold
    - _Requirements: 9.3, 9.4_

  - [x] 19.2 Implementasi code splitting dan lazy loading
    - Dynamic import untuk `PropertyMap` (Leaflet berat)
    - Dynamic import untuk lightbox component
    - Verifikasi React Query caching strategy (stale-while-revalidate)
    - _Requirements: 9.1_

  - [ ]* 19.3 Tulis performance tests
    - Test: skeleton loader muncul saat data loading
    - Test: placeholder image muncul saat image gagal load
    - Test: lazy loading attribute ada pada thumbnail images
    - _Requirements: 9.2, 9.3, 9.5_

- [x] 20. Implementasi accessibility enhancements
  - [x] 20.1 Audit dan perbaiki semantic HTML di semua pages
    - Pastikan struktur: `<header>`, `<nav>`, `<main>`, `<article>` (untuk property cards), `<footer>`
    - Tambahkan "Skip to main content" link di awal body
    - Verifikasi heading hierarchy (h1 → h2 → h3) di setiap page
    - _Requirements: 12.4_

  - [x] 20.2 Audit dan perbaiki keyboard navigation
    - Verifikasi tab order logis di semua interactive elements
    - Pastikan focus indicator visible (Tailwind `focus:ring` atau custom outline)
    - Test keyboard navigation di FilterPanel, ImageGallery lightbox, Modal
    - _Requirements: 12.2, 12.3_

  - [x] 20.3 Audit ARIA labels dan alt texts
    - Semua icon buttons memiliki `aria-label` yang deskriptif
    - Semua images memiliki `alt` text yang bermakna
    - Form inputs memiliki label yang terasosiasi
    - _Requirements: 12.1, 12.5, 12.6_

  - [ ]* 20.4 Tulis accessibility tests dengan axe-core
    - Setup `@axe-core/react` atau `jest-axe` di test setup
    - Test: PropertyCard tidak memiliki accessibility violations
    - Test: ContactForm tidak memiliki accessibility violations
    - Test: Navigation tidak memiliki accessibility violations
    - Test: color contrast check untuk teks utama
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_

- [ ] 21. Setup E2E tests dengan Playwright
  - [ ]* 21.1 Tulis E2E test: Splash Screen flow
    - User membuka website untuk pertama kali
    - Verifikasi splash screen muncul dengan logo, title, dan tombol "Mulai"
    - Test auto-hide setelah 5 detik (optional)
    - User mengklik tombol "Mulai"
    - Verifikasi smooth transition ke halaman utama
    - Test ESC key untuk skip splash screen
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.8_

  - [ ]* 21.2 Tulis E2E test: Search dan Filter flow
    - User membuka halaman Cari Properti
    - User mengetik query di search bar, menunggu hasil
    - User mengaplikasikan filter (bedrooms, price range)
    - Verifikasi property list diperbarui sesuai filter
    - _Requirements: 2.1, 2.2, 3.6_

  - [ ]* 21.3 Tulis E2E test: Property Detail flow
    - User mengklik PropertyCard dari listing
    - Verifikasi navigasi ke detail page
    - User mengklik thumbnail di gallery
    - User membuka lightbox dan navigasi dengan keyboard
    - User mengklik "Hubungi Agen" dan mengisi ContactForm
    - _Requirements: 4.1, 5.3, 5.5, 5.6, 6.1_

  - [ ]* 21.4 Tulis E2E test: Favorites flow
    - User menambah properti ke favorites dari listing
    - User navigasi ke halaman Favorites
    - Verifikasi properti muncul di halaman Favorites
    - User menghapus properti dari favorites
    - _Requirements: 11.1, 11.2, 11.4, 11.5_

  - [ ]* 21.5 Tulis E2E test: Responsive navigation (mobile)
    - Test dengan viewport mobile (375px)
    - Verifikasi hamburger menu muncul
    - User membuka dan menutup mobile menu
    - User membuka filter drawer di mobile
    - _Requirements: 7.2, 7.3, 8.5_

- [ ] 22. Final checkpoint — Pastikan semua tests lulus, build berhasil, tanya user jika ada pertanyaan.

## Notes

- Tasks bertanda `*` bersifat opsional dan dapat dilewati untuk MVP yang lebih cepat
- Setiap task mereferensikan requirements spesifik untuk traceability
- MSW digunakan untuk semua API mocking — tidak ada backend yang perlu dibangun
- Checkpoint memastikan validasi incremental sebelum melanjutkan ke fase berikutnya
- E2E tests (task 21) memerlukan development server berjalan di `http://localhost:3000`
