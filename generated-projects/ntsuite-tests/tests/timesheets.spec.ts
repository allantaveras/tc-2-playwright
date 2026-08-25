import { test, expect } from '@playwright/test';
import { ensureAuthenticated, AUTH_ROLES } from '../utils/authHelper';

test.describe('Timesheets Module', () => {
  test('T-001: Items are available', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByText('Timesheets').click();
    await page.getByText('List of Timesheets').click();
    await expect(page.getByText('Timesheet periods')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Search by team' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Search by poc' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Generate' })).toBeVisible();
  });

  test('T-010: Generate timesheet', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByText('Timesheets').click();
    await page.getByText('List of Timesheets').click();
    await page.getByRole('button', { name: /Generate/i }).click();
    await page.getByRole('dialog').getByRole('textbox', { name: 'Year' }).fill('2026');
    await page.getByRole('dialog').getByRole('textbox', { name: /month/i }).first().fill('January');
    await page.getByRole('dialog').getByRole('button', { name: /generate/i }).click();
  });

  test('T-004: Filter by team', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByText('Timesheets').click();
    await page.getByText('List of Timesheets').click();
    await page.getByRole('textbox', { name: 'Search by team' }).fill('STARB');
  });
});
