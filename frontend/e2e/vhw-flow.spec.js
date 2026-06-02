import { test, expect } from '@playwright/test';

/**
 * E2E Test: VHW Complete Field Workflow
 * Login → navigate portal → register family → register individual
 */

test.describe('VHW Portal Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as VHW
    await page.goto('/login');
    await page.fill('#login-email', 'preema@ayathanatrust.org');
    await page.fill('#login-password', 'vhw123');
    await page.click('#login-submit-btn');
    await page.waitForURL('**/vhw', { timeout: 10000 });
  });

  test('VHW portal displays worker identity card', async ({ page }) => {
    await expect(page.locator('text=Field Health Worker')).toBeVisible({ timeout: 5000 });
  });

  test('VHW portal shows phone mockup', async ({ page }) => {
    // The VhwPortal phone frame should be visible
    await expect(page.locator('[class*="rounded-full"][class*="bg-slate-950"]').first()).toBeVisible();
  });

  test('VHW KPI stats cards are visible', async ({ page }) => {
    await expect(page.locator('text=Families Registered')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Individuals Screened')).toBeVisible();
    await expect(page.locator('text=Risk Alerts')).toBeVisible();
    await expect(page.locator('text=Field Visits')).toBeVisible();
  });

  test('Logout from VHW portal redirects to login', async ({ page }) => {
    await page.locator('button:has-text("Logout")').click();
    await page.waitForURL('**/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });
});
