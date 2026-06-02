import { api } from './apiClient';

/**
 * Attendance Service — Domain layer for VHW shift clock-in/clock-out.
 */

/** Fetch attendance records. */
export const getAttendances = (params = {}) =>
  api.get('/attendances', { params });

/** Record a GPS check-in for the current shift. */
export const checkIn = (data) =>
  api.post('/attendance/check-in', data);

/** Record GPS check-out at end of shift. */
export const checkOut = (data) =>
  api.post('/attendance/check-out', data);
