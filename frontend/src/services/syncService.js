import { api } from './apiClient';

/**
 * Sync Service — Domain layer for PWA offline queue synchronization.
 * Flushes Dexie.js-queued records to the central MySQL backend.
 */

/**
 * Push the offline queue payload to the server.
 * @param {Array} queue - Array of pending offline operations
 * @returns {Promise<{success: boolean, synced: number, conflicts: number}>}
 */
export const syncOfflineQueue = (queue) =>
  api.post('/sync', { queue });
