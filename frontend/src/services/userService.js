import { api } from './apiClient';

/**
 * User Management Service — Super Admin operations.
 */
export const getUsers = (params = {}) =>
  api.get('/admin/users', { params });

export const createProjectDirector = (data) =>
  api.post('/admin/users/project-director', data);

export const createVhw = (data) =>
  api.post('/admin/users/vhw', data);

export const toggleUserStatus = (id) =>
  api.patch(`/admin/users/${id}/status`);

export const resetUserPassword = (id) =>
  api.post(`/admin/users/${id}/reset-password`);

export const assignArea = (id, data) =>
  api.post(`/admin/users/${id}/assign-area`, data);

export const getRoles = () =>
  api.get('/admin/roles');
