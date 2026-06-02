import { describe, it, expect } from 'vitest';
import { login, logout, getProfile } from '../../../services/authService';

describe('authService', () => {
  it('login() — returns token and user on valid credentials', async () => {
    const response = await login('admin@ayathanatrust.org', 'admin123');
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('token');
    expect(response.data.token.length).toBeGreaterThan(10);
    expect(response.data.user).toHaveProperty('email', 'admin@ayathanatrust.org');
    expect(response.data.user).toHaveProperty('role', 'Super Admin (Trust)');
  });

  it('login() — response user has required fields', async () => {
    const response = await login('admin@ayathanatrust.org', 'admin123');
    const { user } = response.data;
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('role');
  });

  it('logout() — returns 200 with message', async () => {
    const response = await logout();
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('message');
  });

  it('getProfile() — returns authenticated user profile', async () => {
    const response = await getProfile();
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('role');
  });
});
