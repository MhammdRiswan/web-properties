import type { Metadata } from 'next';
import './globals.css';
import { ClientLayout } from '@/components/layout/ClientLayout';
import { ReactQueryProvider } from '@/components/providers/ReactQueryProvider';
import { MSWProvider } from '@/components/providers/MSWProvider';
import { ErrorBoundary } from '@/components/providers/ErrorBoundary';

export const metadata: Metadata = {
  title: 'GriyaKu — Temukan Rumah Impian Anda',
  description:
    'Platform terpercaya untuk menemukan properti perumahan impian Anda di Indonesia. Jelajahi ribuan listing rumah, townhouse, dan villa.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full font-sans antialiased">
      <body className="min-h-full bg-white text-gray-900">
        {/* Skip to main content — accessibility shortcut (Requirement 12.4) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-red-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium focus:shadow-lg"
        >
          Lewati ke konten utama
        </a>

        <ErrorBoundary>
          <MSWProvider>
            <ReactQueryProvider>
              <ClientLayout>
                {children}
              </ClientLayout>
            </ReactQueryProvider>
          </MSWProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
