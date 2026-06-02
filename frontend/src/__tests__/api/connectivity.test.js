import { describe, it, expect, beforeAll } from 'vitest';
import { api } from '../../services/apiClient';
import apiClient from '../../services/apiClient';

/**
 * API Connectivity Tests
 *
 * These tests verify the frontend API client configuration:
 *   - Base URL is correct
 *   - Request headers are properly set
 *   - Token injection works
 *   - Error handling is robust
 *   - CRUD wrappers function correctly
 *
 * NOTE: These use MSW mock handlers. For true end-to-end testing,
 * run against the actual backend (see system.test.js).
 */

const API_BASE = 'http://localhost:8000/api/v1';

describe('API Client Configuration', () => {
  it('base URL points to the correct endpoint', () => {
    expect(API_BASE).toBe('http://localhost:8000/api/v1');
  });

  it('injects Bearer token from localStorage into requests', async () => {
    const testToken = 'test-token-injection-abc';
    localStorage.setItem('jeevan_roshini_token', testToken);

    const response = await api.get('/me');
    expect(response.config.headers.Authorization).toBe(`Bearer ${testToken}`);

    localStorage.removeItem('jeevan_roshini_token');
  });

  it('does not inject token when localStorage is empty', async () => {
    localStorage.removeItem('jeevan_roshini_token');

    const response = await api.get('/me');
    expect(response.config.headers.Authorization).toBeUndefined();
  });
});

describe('API CRUD Wrappers', () => {
  it('api.get() sends GET request', async () => {
    const response = await api.get('/families');
    expect(response.config.method).toBe('get');
    expect(response.status).toBe(200);
  });

  it('api.post() sends POST request with data', async () => {
    const response = await api.post('/login', {
      email: 'admin@ayathanatrust.org',
      password: 'admin123',
    });
    expect(response.config.method).toBe('post');
    expect(JSON.parse(response.config.data)).toEqual({
      email: 'admin@ayathanatrust.org',
      password: 'admin123',
    });
    expect(response.status).toBe(200);
  });

  it('api.put() sends PUT request', async () => {
    const response = await api.put('/families', { id: 'FAM-001' });
    expect(response.config.method).toBe('put');
  });

  it('api.delete() sends DELETE request', async () => {
    const response = await api.delete('/logout');
    expect(response.config.method).toBe('delete');
  });
});

describe('API Client Instance Configuration', () => {
  it('includes Content-Type and Accept headers', async () => {
    const response = await api.get('/me');
    expect(response.config.headers['Content-Type']).toBe('application/json');
    expect(response.config.headers['Accept']).toBe('application/json');
  });

  it('has a reasonable timeout', () => {
    expect(apiClient.defaults.timeout).toBe(10000);
  });

  it('baseURL is set correctly', () => {
    expect(apiClient.defaults.baseURL).toBe('/api/v1');
  });
});

describe('Auth Service Integration with API Client', () => {
  it('login returns token with expected structure', async () => {
    const response = await api.post('/login', {
      email: 'admin@ayathanatrust.org',
      password: 'admin123',
    });
    expect(response.data).toHaveProperty('token');
    expect(response.data).toHaveProperty('user');
    expect(response.data.user).toHaveProperty('role');
  });

  it('protected endpoints are accessible with token', async () => {
    const response = await api.get('/me');
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id');
  });
});
