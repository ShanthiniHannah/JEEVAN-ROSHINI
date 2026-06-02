import { api } from './apiClient';

/**
 * Leave Service — Domain layer for VHW leave request management.
 */

/** Fetch all leave requests. */
export const getLeaves = (params = {}) =>
  api.get('/leaves', { params });

/** Submit a new leave request. */
export const createLeave = (data) =>
  api.post('/leaves', data);
