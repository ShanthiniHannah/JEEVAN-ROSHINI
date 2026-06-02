import { api } from './apiClient';

/**
 * Visit Service — Domain layer for VHW household visit logs.
 */

/** Fetch all field visits. */
export const getVisits = (params = {}) =>
  api.get('/visits', { params });

/** Log a new household visit with vitals. */
export const createVisit = (data) =>
  api.post('/visits', data);
