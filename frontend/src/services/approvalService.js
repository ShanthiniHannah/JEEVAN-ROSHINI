import { api } from './apiClient';

/**
 * Approval Service — Domain layer for Project Director approval workflows.
 */

/**
 * Perform an approval or rejection action.
 * @param {object} data - { type: 'leave'|'referral', id: string, action: 'approve'|'reject', notes?: string }
 */
export const approvalAction = (data) =>
  api.post('/approvals/action', data);
