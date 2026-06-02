import { test, expect } from '@playwright/test';

/**
 * E2E Test: Login Flow
 * Tests complete login → role-based redirect → portal landing
 */

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('login page renders correctly', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Jeevan Roshini');
    await expect(page.locator('#login-email')).toBeVisible();
    await expect(page.locator('#login-password')).toBeVisible();
    await expect(page.locator('#login-submit-btn')).toBeVisible();
  });

  test('Super Admin login redirects to /admin', async ({ page }) => {
    await page.fill('#login-email', 'admin@ayathanatrust.org');
    await page.fill('#login-password', 'admin123');
    await page.click('#login-submit-btn');
    await page.waitForURL('**/admin', { timeout: 10000 });
    expect(page.url()).toContain('/admin');
  });

  test('VHW login redirects to /vhw', async ({ page }) => {
    await page.fill('#login-email', 'preema@ayathanatrust.org');
    await page.fill('#login-password', 'vhw123');
    await page.click('#login-submit-btn');
    await page.waitForURL('**/vhw', { timeout: 10000 });
    expect(page.url()).toContain('/vhw');
  });

  test('Director login redirects to /director', async ({ page }) => {
    await page.fill('#login-email', 'director@ayathanatrust.org');
    await page.fill('#login-password', 'director123');
    await page.click('#login-submit-btn');
    await page.waitForURL('**/director', { timeout: 10000 });
    expect(page.url()).toContain('/director');
  });

  test('invalid credentials shows error message', async ({ page }) => {
    await page.fill('#login-email', 'wrong@test.com');
    await page.fill('#login-password', 'wrongpass');
    await page.click('#login-submit-btn');
    await expect(page.locator('.text-rose-400')).toBeVisible({ timeout: 5000 });
  });

  test('quick demo login buttons work', async ({ page }) => {
    // Click first quick login (Super Admin)
    await page.locator('button:has-text("Super Admin")').first().click();
    await page.waitForURL('**/admin', { timeout: 10000 });
    expect(page.url()).toContain('/admin');
  });
});
