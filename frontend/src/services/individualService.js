import { api } from './apiClient';

/**
 * Individual Service — Domain layer for patient demographic operations.
 */

/** Fetch all individuals with optional filters. */
export const getIndividuals = (params = {}) =>
  api.get('/individuals', { params });

/** Register a new individual health record. */
export const createIndividual = (data) =>
  api.post('/individuals', data);

/** Reveal PII for a specific individual (privileged operation). */
export const revealPii = (id) =>
  api.post(`/individuals/${id}/reveal`);
