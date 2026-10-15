/**
 * MSW Server Setup
 * Initializes Mock Service Worker for Node.js test environment
 */

/// <reference types="vitest/globals" />

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Setup server with handlers for testing
export const server = setupServer(...handlers);

// Establish API mocking before all tests
export function setupMockServer() {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'bypass' });
  });

  // Reset handlers after each test
  afterEach(() => {
    server.resetHandlers();
  });

  // Clean up after all tests
  afterAll(() => {
    server.close();
  });
}
