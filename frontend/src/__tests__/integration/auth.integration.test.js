import { describe, it, expect } from 'vitest';
import { login, getProfile, logout } from '../../services/authService';

/**
 * Integration Test: Full Authentication Flow
 *
 * Tests the complete sequence:
 *   1. POST /login → receive token + user
 *   2. Store token in localStorage
 *   3. GET /me → verify profile matches
 *   4. POST /logout → session cleared
 */
describe('Auth Integration Flow', () => {
  it('complete login → profile → logout cycle', async () => {
    // Step 1: Login
    const loginRes = await login('admin@ayathanatrust.org', 'admin123');
    expect(loginRes.status).toBe(200);
    const { token, user } = loginRes.data;
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(5);

    // Step 2: Simulate token storage
    localStorage.setItem('jeevan_roshini_token', token);

    // Step 3: Fetch authenticated profile
    const profileRes = await getProfile();
    expect(profileRes.status).toBe(200);
    expect(profileRes.data.email).toBe(user.email);
    expect(profileRes.data.role).toBe('Super Admin (Trust)');

    // Step 4: Logout
    const logoutRes = await logout();
    expect(logoutRes.status).toBe(200);

    // Clean up
    localStorage.removeItem('jeevan_roshini_token');
  });

  it('login response contains all required user fields', async () => {
    const { data } = await login('preema@ayathanatrust.org', 'vhw123');
    const requiredFields = ['id', 'name', 'email', 'role'];
    requiredFields.forEach(field => {
      expect(data.user).toHaveProperty(field);
    });
  });
});
