'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import Link from 'next/link';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Global error boundary that catches unhandled React render errors.
 * Displays a user-friendly fallback UI with a retry option.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for monitoring — replace with a real service (e.g. Sentry) if needed
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
        >
          <div className="max-w-md w-full text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <h1 className="text-xl font-semibold text-gray-900">
                Terjadi Kesalahan
              </h1>
              <p className="text-gray-600 text-sm">
                Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Coba Lagi
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
