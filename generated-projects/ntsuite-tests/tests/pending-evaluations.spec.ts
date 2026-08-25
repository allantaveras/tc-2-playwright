import { test, expect } from '@playwright/test';
import { ensureAuthenticated, AUTH_ROLES } from '../utils/authHelper';

test.describe('Pending Evaluations Module', () => {
  test.beforeEach(async ({ page }) => {
    // Navigation is handled per-test based on preconditions
  });

  test('PE-001: Items are available', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Evaluations').click();
    await expect(page.getByText(/the following items are available:/i).first()).toBeVisible();
    // Pending Evaluations title
    // Period indicator
    // Filter by name
    // Filter by employee ID
    // Table with columns: Branch, Employee ID, Name, Position, Client, Team, Q1, Q2, Q3, Q4 buttons
    // Items per page dropdown
    // Pagination buttons
    // Expected: Items are available
    await expect(page.getByText(/Items are available/i).first()).toBeVisible();
  });

  test('PE-002: Filter by name', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Evaluations').click();
    await page.getByPlaceholder(/a name in the filter search/i).fill('value');
    // Expected: Employee shows on the pending evaluations table
    await expect(page.getByText(/Employee shows on the pending evaluations table/i).first()).toBeVisible();
  });

  test('PE-003: Filter by employee ID', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Evaluations').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee in the employee ID dropdown/i }).click();
    // Expected: Employee shows on the pending evaluations table
    await expect(page.getByText(/Employee shows on the pending evaluations table/i).first()).toBeVisible();
  });

  test('PE-004: Delete signature', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Evaluations').click();
    // Open a pending evaluation
    await page.getByRole('button', { name: /the trash icon to delete the preloaded signature/i }).click();
    // Expected: Signature is deleted
    await expect(page.getByText(/Signature is deleted/i).first()).toBeVisible();
  });

  test('PE-005: Generate signature', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Evaluations').click();
    // Open a pending evaluation
    await page.getByRole('button', { name: /the refresh icon button to generate a signature/i }).click();
    // Expected: Signature is generated
    await expect(page.getByText(/Signature is generated/i).first()).toBeVisible();
  });

  test('PE-006: Items per page', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Evaluations').click();
    await expect(page.getByText(/table shows 10 items/i).first()).toBeVisible();
    // Change Items per page to '20'
    await expect(page.getByText(/table shows 20 items/i).first()).toBeVisible();
    // Change Items per page to '50'
    await expect(page.getByText(/table shows 50 items/i).first()).toBeVisible();
    // Expected: Table to adjust ammount of records apropiately
    await expect(page.getByText(/Table to adjust ammount of records apropiately/i).first()).toBeVisible();
  });

  test('PE-007: Pagination buttons', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Evaluations').click();
    await page.getByRole('button', { name: /pagination button 2/i }).click();
    await page.getByRole('button', { name: /pagination button 1/i }).click();
    // Expected: Records to navigate through pages
    await expect(page.getByText(/Records to navigate through pages/i).first()).toBeVisible();
  });
});
