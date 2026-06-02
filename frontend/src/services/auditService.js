import { api } from './apiClient';

/**
 * Audit Service — Domain layer for immutable audit trail retrieval (Super Admin only).
 */

/** Fetch paginated audit logs. */
export const getAudits = (params = {}) =>
  api.get('/audits', { params });
