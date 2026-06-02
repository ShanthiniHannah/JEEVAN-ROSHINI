import { api } from './apiClient';

/**
 * Family Service — Domain layer for family registry operations.
 */

/** Fetch all families (paginated by backend). */
export const getFamilies = (params = {}) =>
  api.get('/families', { params });

/** Register a new family household. */
export const createFamily = (data) =>
  api.post('/families', data);
