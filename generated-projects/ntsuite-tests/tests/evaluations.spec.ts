import { test, expect } from '@playwright/test';
import { ensureAuthenticated, AUTH_ROLES } from '../utils/authHelper';

test.describe('Evaluations Module', () => {
  test('ME-001: Items are available - My Evaluations', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByText('Evaluations').click();
    await page.getByText('My Evaluations').click();
    await expect(page.getByText('My Evaluations')).toBeVisible();
    await expect(page.getByText('Supervisor').first()).toBeVisible();
    await expect(page.getByText('Year')).toBeVisible();
  });

  test('LE-001: Items are available - List of Evaluations', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByText('Evaluations').click();
    await page.getByText('List of Evaluations').click();
    await expect(page.getByText('Evaluations Management')).toBeVisible();
  });

  test('PE-001: Items are available - Pending Evaluations', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByText('Evaluations').click();
    await page.getByText('Pending Evaluations').click();
    await expect(page.getByText('Pending Evaluations')).toBeVisible();
  });

  test('RH-001: Items are available - Record History', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByText('Evaluations').click();
    await page.getByText('Record History').click();
    await expect(page.getByText('Record History')).toBeVisible();
  });
});
