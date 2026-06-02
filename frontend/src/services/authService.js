import { api } from './apiClient';

/**
 * Auth Service — Domain layer for authentication operations.
 * Controllers (components/hooks) call these functions, never the API client directly.
 */

/**
 * Authenticate user with email + password.
 * @returns {Promise<{token: string, user: object}>}
 */
export const login = (email, password) =>
  api.post('/login', { email, password });

/**
 * Invalidate the current Sanctum session.
 * @returns {Promise<void>}
 */
export const logout = () =>
  api.post('/logout');

/**
 * Fetch the authenticated user profile from the server.
 * @returns {Promise<object>} user profile data
 */
export const getProfile = () =>
  api.get('/me');
