import { api } from './apiClient';

/**
 * Dashboard Service — Domain layer for aggregate metrics and analytics.
 */

/** Fetch dashboard overview metrics (Redis-cached for 10 minutes). */
export const getDashboard = () =>
  api.get('/dashboard');

/** Fetch all villages (geography lookup). */
export const getVillages = () =>
  api.get('/villages');

/** Trigger an encrypted cloud database backup (Super Admin only). */
export const runBackup = () =>
  api.post('/admin/backups');
