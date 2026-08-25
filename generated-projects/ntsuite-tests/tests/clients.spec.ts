import { test, expect } from '@playwright/test';
import { ensureAuthenticated, AUTH_ROLES } from '../utils/authHelper';

test.describe('Clients Module', () => {
  test.beforeEach(async ({ page }) => {
    // Navigation is handled per-test based on preconditions
  });

  test('C-001: Items are available', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await expect(page.getByText(/the following items are available:/i).first()).toBeVisible();
    // Client Management Title
    // +Add a new client button
    // Search by name filter
    // Status filter
    // Table with clients
    // Deactivate client button
    // Items per page dropdown
    // Pagination buttons
    // Expected: All items to be available
    await expect(page.getByText(/All items to be available/i).first()).toBeVisible();
  });

  test('C-002: Create active client', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /+Add a new client/i }).click();
    await page.getByPlaceholder(/name textbox/i).fill('value');
    // Pick a color
    // Set the status checkbox to active
    await page.getByRole('button', { name: /Save button/i }).click();
    // Expected: New client to be listed in the clients table
    await expect(page.getByText(/New client to be listed in the clients table/i).first()).toBeVisible();
  });

  test('C-003: Create client wiht invalid color', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /+Add a new client/i }).click();
    await page.getByPlaceholder(/name textbox/i).fill('value');
    // Pick an invalid  color eg. FF
    // Set the status checkbox to active
    await page.getByRole('button', { name: /Save button/i }).click();
    // Expected: Colorpicker to select a valid color
    await expect(page.getByText(/Colorpicker to select a valid color/i).first()).toBeVisible();
  });

  test('C-004: Create inactive client', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /+Add a new client/i }).click();
    await page.getByPlaceholder(/name textbox/i).fill('value');
    // Pick a color
    // Set the status checkbox to Inactive
    await page.getByRole('button', { name: /Save button/i }).click();
    // Expected: Inactive client to be created
    await expect(page.getByText(/Inactive client to be created/i).first()).toBeVisible();
  });

  test('C-005: Edit Client', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /pencil icon to edit a client/i }).click();
    // Change the name
    // Pick a color
    // Set the status checkbox to active
    await page.getByRole('button', { name: /Save button/i }).click();
    // Expected: Client to be edited with new name
    await expect(page.getByText(/Client to be edited with new name/i).first()).toBeVisible();
  });

  test('C-006: Edit client with invalid color', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /pencil icon to edit a client/i }).click();
    // Pick an invalid  color eg. FF
    await page.getByRole('button', { name: /Save button/i }).click();
    // Expected: Colorpicker to select a valid color
    await expect(page.getByText(/Colorpicker to select a valid color/i).first()).toBeVisible();
  });

  test('C-007: Edit client status', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /pencil icon to edit a client/i }).click();
    // Uncheck status checkbox
    await page.getByRole('button', { name: /Save button/i }).click();
    // Filter by status Inactive
    // Expected: Inactive client to show in the clients table
    await expect(page.getByText(/Inactive client to show in the clients table/i).first()).toBeVisible();
  });

  test('C-008: Filter by name', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByPlaceholder(/a client's name in the Search by name searchbar/i).fill('value');
    // Expected: Client to show in the clients table
    await expect(page.getByText(/Client to show in the clients table/i).first()).toBeVisible();
  });

  test('C-009: Filter by status active', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /Active in the status filter/i }).click();
    // Expected: Active clients to show on the clients table
    await expect(page.getByText(/Active clients to show on the clients table/i).first()).toBeVisible();
  });

  test('C-010: Filter by status inactive', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /Inactive in the status filter/i }).click();
    // Expected: Inactive clients to show on the clients table
    await expect(page.getByText(/Inactive clients to show on the clients table/i).first()).toBeVisible();
  });

  test('C-011: Items per page', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await expect(page.getByText(/table shows 10 items/i).first()).toBeVisible();
    // Change Items per page to '20'
    await expect(page.getByText(/table shows 20 items/i).first()).toBeVisible();
    // Change Items per page to '50'
    await expect(page.getByText(/table shows 50 items/i).first()).toBeVisible();
    // Expected: Table to adjust ammount of records apropiately
    await expect(page.getByText(/Table to adjust ammount of records apropiately/i).first()).toBeVisible();
  });

  test('C-012: Pagination buttons', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /pagination button 2/i }).click();
    await page.getByRole('button', { name: /pagination button 1/i }).click();
    // Expected: Records to navigate through pages
    await expect(page.getByText(/Records to navigate through pages/i).first()).toBeVisible();
  });

  test('C-013: Pagination then search back', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /pagination button 2/i }).click();
    // Filter by name using a client in page 1
    await page.getByRole('button', { name: /pagination button 1/i }).click();
    // Expected: Client to show in the clients table and page navigates to the first page
    await expect(page.getByText(/Client to show in the clients table and page navig/i).first()).toBeVisible();
  });
});
