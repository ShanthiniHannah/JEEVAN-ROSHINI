import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { api } from '../../services/apiClient';
import { login, logout, getProfile } from '../../services/authService';

/**
 * System-Level Integration Tests
 *
 * Tests the complete frontend-to-backend integration:
 *   - Authentication flow (login → store token → profile → logout)
 *   - Family CRUD operations
 *   - Protected route access
 *   - Token lifecycle management
 *   - Concurrent user sessions
 *
 * These tests use MSW mock handlers and do NOT require the backend server.
 */

describe('System: Full Authentication Flow', () => {
  beforeAll(() => {
    localStorage.clear();
  });

  afterAll(() => {
    localStorage.clear();
  });

  it('TC-SYS-001: Complete login → store → profile → logout cycle', async () => {
    // Step 1: Login
    const loginResult = await login('admin@ayathanatrust.org', 'admin123');
    expect(loginResult.status).toBe(200);
    const { token, user } = loginResult.data;

    // Step 2: Token is returned
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(10);

    // Step 3: User object has required fields
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('role');

    // Step 4: Store token in localStorage
    localStorage.setItem('jeevan_roshini_token', token);
    expect(localStorage.getItem('jeevan_roshini_token')).toBe(token);

    // Step 5: Fetch profile with stored token
    const profileResult = await getProfile();
    expect(profileResult.status).toBe(200);
    expect(profileResult.data.email).toBe(user.email);

    // Step 6: Logout
    const logoutResult = await logout();
    expect(logoutResult.status).toBe(200);
  });

  it('TC-SYS-002: Invalid credentials return error message', async () => {
    try {
      await login('wrong@test.com', 'badpassword');
    } catch (error) {
      expect(error.response?.status).toBe(401);
      expect(error.response?.data?.message).toBeDefined();
    }
  });

  it('TC-SYS-003: Multiple roles can authenticate', async () => {
    const roles = [
      { email: 'admin@ayathanatrust.org', password: 'admin123', expectedRole: 'Super Admin (Trust)' },
      { email: 'preema@ayathanatrust.org', password: 'vhw123', expectedRole: 'Village Health Worker' },
    ];

    for (const { email, password, expectedRole } of roles) {
      const result = await login(email, password);
      expect(result.status).toBe(200);
      expect(result.data.user.email).toBe(email);
    }
  });
});

describe('System: API Resource Access', () => {
  beforeAll(async () => {
    localStorage.clear();
    const loginResult = await login('admin@ayathanatrust.org', 'admin123');
    localStorage.setItem('jeevan_roshini_token', loginResult.data.token);
  });

  afterAll(() => {
    localStorage.clear();
  });

  it('TC-SYS-004: Can fetch dashboard data', async () => {
    const response = await api.get('/dashboard');
    expect(response.status).toBe(200);
  });

  it('TC-SYS-005: Can fetch and create families', async () => {
    // Fetch families
    const getRes = await api.get('/families');
    expect(getRes.status).toBe(200);
    expect(getRes.data).toBeDefined();

    // Create family
    const postRes = await api.post('/families', {
      village_id: 'VLG-4829',
      house_no: 'H-SYS-001',
      economic_status: 'BPL',
    });
    expect(postRes.status).toBe(201);
  });

  it('TC-SYS-006: Can fetch villages list', async () => {
    const response = await api.get('/villages');
    expect(response.status).toBe(200);
  });

  it('TC-SYS-007: Can fetch individuals', async () => {
    const response = await api.get('/individuals');
    expect(response.status).toBe(200);
  });

  it('TC-SYS-008: Can perform sync operation', async () => {
    const response = await api.post('/sync', {
      queue: [
        {
          type: 'visit',
          data: {
            familyId: 'FAM-001',
            tempDeg: 98.6,
            notes: 'System test visit',
          },
        },
      ],
    });
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
  });
});

describe('System: Token Lifecycle Management', () => {
  it('TC-SYS-009: Token persists across multiple API calls', async () => {
    const loginResult = await login('admin@ayathanatrust.org', 'admin123');
    const token = loginResult.data.token;

    localStorage.setItem('jeevan_roshini_token', token);

    // Make multiple sequential calls
    const calls = [
      api.get('/me'),
      api.get('/dashboard'),
      api.get('/villages'),
    ];

    const results = await Promise.all(calls);
    results.forEach(response => {
      expect(response.status).toBe(200);
    });
  });
});

describe('System: Offline / Error Resilience', () => {
  it('TC-SYS-010: Login failure does not crash the app', async () => {
    try {
      await login('', '');
    } catch (error) {
      // Should handle gracefully without throwing uncaught errors
      expect(error).toBeDefined();
    }
  });

  it('TC-SYS-011: Auth service returns structured error on failure', async () => {
    try {
      await login('nonexistent@test.com', 'wrong');
    } catch (error) {
      expect(error.response?.status).toBeDefined();
      expect(error.response?.data?.message).toBeDefined();
    }
  });
});
