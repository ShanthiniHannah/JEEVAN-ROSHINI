import { test, expect } from '@playwright/test';

/**
 * E2E Test: Approval Workflow (Project Director)
 * Login → navigate director portal → verify approvals section
 */

test.describe('Director Approval Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('#login-email', 'director@ayathanatrust.org');
    await page.fill('#login-password', 'director123');
    await page.click('#login-submit-btn');
    await page.waitForURL('**/director', { timeout: 10000 });
  });

  test('Director portal loads with correct user name', async ({ page }) => {
    await expect(page.locator('text=Dr. Ramesh Kumar')).toBeVisible({ timeout: 5000 });
  });

  test('Director portal has Project Director role badge', async ({ page }) => {
    await expect(page.locator('text=Project Director')).toBeVisible({ timeout: 5000 });
  });

  test('Director portal environment badge shows Production', async ({ page }) => {
    await expect(page.locator('text=Production')).toBeVisible({ timeout: 5000 });
  });

  test('Logout from director portal returns to login', async ({ page }) => {
    await page.locator('button:has-text("Logout")').click();
    await page.waitForURL('**/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });
});
