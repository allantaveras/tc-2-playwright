import { test, expect } from '@playwright/test';
import { ensureAuthenticated, AUTH_ROLES } from '../utils/authHelper';

test.describe('Timesheet Builder Module', () => {
  test.beforeEach(async ({ page }) => {
    // Navigation is handled per-test based on preconditions
  });

  test('TB-001: Items are available', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByText('Timesheets').click();
    await expect(page.getByText(/the following items are available:/i).first()).toBeVisible();
    // Timesheet Builder title
    // +New Timesheet button
    // Table with Name, ClIent, poc,Created,Status, Number of Teams and actions columns
    // Items per page dropdown
    // Pagination buttons
    // Expected: Items are available
    await expect(page.getByText(/Items are available/i).first()).toBeVisible();
  });

  test('TB-002: Create an unified timesheet', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('button', { name: /'+New Timesheet' button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Client/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a POC/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a group of teams/i }).click();
    await page.getByPlaceholder(/a name/i).fill('value');
    await page.getByRole('button', { name: /Create/i }).click();
    await page.getByText('List of Timesheets').click();
    // Generate Timesheet for the next month
    // Expected: Template is created correctly and timesheet is generated with team data
    await expect(page.getByText(/Template is created correctly and timesheet is gen/i).first()).toBeVisible();
  });

  test('TB-003: Create an unified timesheet with half of available teams', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('button', { name: /'+New Timesheet' button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Client/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a POC/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /only half of the teams available/i }).click();
    await page.getByPlaceholder(/a name/i).fill('value');
    await page.getByRole('button', { name: /Create/i }).click();
    await page.getByText('List of Timesheets').click();
    // Generate Timesheet for the next month
    // Expected: Template is created correctly and timesheet is generated with team data
    await expect(page.getByText(/Template is created correctly and timesheet is gen/i).first()).toBeVisible();
  });

  test('TB-004: Edit an unified timesheet', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('button', { name: /the pencil icon to edit a timesheet template/i }).click();
    // Change client
    // Change POC
    // Change amount of teams
    // Change name
    await page.getByRole('button', { name: /'Save' button/i }).click();
    await page.getByText('List of Timesheets').click();
    // Generate timesheets for next month
    // Expected: All changes are applied to the template and timesheet is generated with new changes
    await expect(page.getByText(/All changes are applied to the template and timesh/i).first()).toBeVisible();
  });

  test('TB-005: Delete an unified timesheet', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('button', { name: /the trash icon on a timesheet to delete it/i }).click();
    // Confirm by clicking delete button in the popup
    await page.getByText('List of Timesheets').click();
    // Generate timesheets for next month
    // Expected: Template is removed from the list and timesheet is not generated
    await expect(page.getByText(/Template is removed from the list and timesheet is/i).first()).toBeVisible();
  });

  test('TB-006: Items per page', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await expect(page.getByText(/table shows 10 items/i).first()).toBeVisible();
    // Change Items per page to '20'
    await expect(page.getByText(/table shows 20 items/i).first()).toBeVisible();
    // Change Items per page to '50'
    await expect(page.getByText(/table shows 50 items/i).first()).toBeVisible();
    // Expected: Table to adjust ammount of records apropiately
    await expect(page.getByText(/Table to adjust ammount of records apropiately/i).first()).toBeVisible();
  });
});
