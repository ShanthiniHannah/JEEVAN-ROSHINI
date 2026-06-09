import '@testing-library/jest-dom';
import { afterEach, beforeAll, afterAll } from 'vitest';

// Fix for Node 22+ native localStorage overriding/conflicting with JSDOM
class StorageMock {
  constructor() {
    this.store = {};
  }
  clear() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] !== undefined ? this.store[key] : null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  get length() {
    return Object.keys(this.store).length;
  }
  key(index) {
    return Object.keys(this.store)[index] || null;
  }
}

const mockLS = new StorageMock();
const mockSS = new StorageMock();

Object.defineProperty(globalThis, 'localStorage', {
  value: mockLS,
  writable: true,
  configurable: true
});
Object.defineProperty(globalThis, 'sessionStorage', {
  value: mockSS,
  writable: true,
  configurable: true
});

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: mockLS,
    writable: true,
    configurable: true
  });
  Object.defineProperty(window, 'sessionStorage', {
    value: mockSS,
    writable: true,
    configurable: true
  });
}
import { cleanup } from '@testing-library/react';
import { server } from './mocks/server';

// Clean up DOM after each test
afterEach(() => cleanup());

// Start MSW API mock server
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
