import { test, expect } from '@playwright/test';
import { ensureAuthenticated, AUTH_ROLES } from '../utils/authHelper';

test.describe('Point of Contact Module', () => {
  test.beforeEach(async ({ page }) => {
    // Navigation is handled per-test based on preconditions
  });

  test('P-001: Items are available', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await expect(page.getByText(/the following items are available:/i).first()).toBeVisible();
    // Point of Contact (POC) Management Title
    // +Add a new POC button
    // Search POCs filter
    // Status filter
    // Table with POCs
    // Deactivate POC button
    // Items per page dropdown
    // Pagination buttons
    // Expected: Items to be available
    await expect(page.getByText(/Items to be available/i).first()).toBeVisible();
  });

  test('P-002: Create POC', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /+Add a new POC/i }).click();
    await page.getByPlaceholder(/name textbox/i).fill('value');
    await page.getByPlaceholder(/email textbox/i).fill('value');
    await page.getByPlaceholder(/phone number/i).fill('value');
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a client/i }).click();
    await page.getByRole('button', { name: /Save button/i }).click();
    // Expected: POC to show in the POCs table
    await expect(page.getByText(/POC to show in the POCs table/i).first()).toBeVisible();
  });

  test('P-003: Create POC with invalid name', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /+Add a new POC/i }).click();
    await page.getByPlaceholder(/name textbox with 1 character/i).fill('value');
    await page.getByPlaceholder(/email textbox/i).fill('value');
    await page.getByPlaceholder(/phone number/i).fill('value');
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a client/i }).click();
    await page.getByRole('button', { name: /Save button/i }).click();
    // Expected: Message under name textbox to show: "Name must be at least 2 characters long"
    await expect(page.getByText(/Message under name textbox to show: "Name must be /i).first()).toBeVisible();
  });

  test('P-004: Create POC with invalid phone number', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /+Add a new POC/i }).click();
    await page.getByPlaceholder(/name textbox/i).fill('value');
    await page.getByPlaceholder(/email textbox/i).fill('value');
    await page.getByPlaceholder(/phone number with 8 digits/i).fill('value');
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a client/i }).click();
    await page.getByRole('button', { name: /Save button/i }).click();
    // Expected: Message under Phone Number textbox to show: "Phone number must be exactly 10 digits"
    await expect(page.getByText(/Message under Phone Number textbox to show: "Phone/i).first()).toBeVisible();
  });

  test('P-005: Create POC with no client', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /+Add a new POC/i }).click();
    await page.getByPlaceholder(/name textbox/i).fill('value');
    await page.getByPlaceholder(/email textbox/i).fill('value');
    await page.getByPlaceholder(/phone number/i).fill('value');
    // Leave the client drodown blank
    await page.getByRole('button', { name: /Save button/i }).click();
    // Expected: Page to throw error: "Error updating the manager"
    await expect(page.getByText(/Page to throw error: "Error updating the manager"/i).first()).toBeVisible();
  });

  test('P-006: Edit POC', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /pencil icon to edit a POC/i }).click();
    // Change name textbox
    // Changeemail textbox
    // Change phone number
    // Change client
    await page.getByRole('button', { name: /Save button/i }).click();
    // Expected: POC to have all fields updated
    await expect(page.getByText(/POC to have all fields updated/i).first()).toBeVisible();
  });

  test('P-007: Edit POC with invalid name', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /pencil icon to edit a POC/i }).click();
    // Change name textbox to 1 character long name
    // Changeemail textbox
    // Change phone number
    // Change client
    await page.getByRole('button', { name: /Save button/i }).click();
    // Expected: Message under name textbox to show: "Name must be at least 2 characters long"
    await expect(page.getByText(/Message under name textbox to show: "Name must be /i).first()).toBeVisible();
  });

  test('P-008: Edit POC with invalid phone', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /pencil icon to edit a POC/i }).click();
    // Change name textbox
    // Change email textbox
    // Change phone number to have 8 digits
    // Change client
    await page.getByRole('button', { name: /Save button/i }).click();
    // Expected: Message under Phone Number textbox to show: "Phone number must be exactly 10 digits"
    await expect(page.getByText(/Message under Phone Number textbox to show: "Phone/i).first()).toBeVisible();
  });

  test('P-009: Edit POC with no client', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /pencil icon to edit a POC/i }).click();
    // Change name textbox
    // Change email textbox
    // Change phone number
    // Clear the client selector
    await page.getByRole('button', { name: /Save button/i }).click();
    // Expected: Page to throw error: "Error updating the manager"
    await expect(page.getByText(/Page to throw error: "Error updating the manager"/i).first()).toBeVisible();
  });

  test('P-010: Filter by name', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByPlaceholder(/the Filter by name searchbox with a POC name/i).fill('value');
    // Expected: Table should show the searched POC
    await expect(page.getByText(/Table should show the searched POC/i).first()).toBeVisible();
  });

  test('P-011: Filter by status active', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    // Set the status filter to Active
    // Expected: Table should show only active POCs
    await expect(page.getByText(/Table should show only active POCs/i).first()).toBeVisible();
  });

  test('P-012: Filter by status inactive', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    // Set the status filter to Inactive
    // Expected: Table should show only inactive POCs
    await expect(page.getByText(/Table should show only inactive POCs/i).first()).toBeVisible();
  });

  test('P-013: Items per page', async ({ page }) => {
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

  test('P-014: Pagination buttons', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /pagination button 2/i }).click();
    await page.getByRole('button', { name: /pagination button 1/i }).click();
    // Expected: Records to navigate through pages
    await expect(page.getByText(/Records to navigate through pages/i).first()).toBeVisible();
  });

  test('P-015: Pagination then search back', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /pagination button 2/i }).click();
    // Filter by name using a client in page 1
    await page.getByRole('button', { name: /pagination button 1/i }).click();
    // Expected: POC to show in the clients table and page navigates to the first page
    await expect(page.getByText(/POC to show in the clients table and page navigate/i).first()).toBeVisible();
  });
});
