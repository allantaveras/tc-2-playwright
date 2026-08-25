import { test, expect } from '@playwright/test';
import { ensureAuthenticated, AUTH_ROLES } from '../utils/authHelper';

test.describe('Skills Module', () => {
  test.beforeEach(async ({ page }) => {
    // Navigation is handled per-test based on preconditions
  });

  test('S-001: Items are available', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await expect(page.getByText(/the following items are available:/i).first()).toBeVisible();
    // Skills Management title
    // '+Add a new skill' button
    // Search by skill filter
    // Skill table
    // Edit skill icon
    // Delete skill icon
    // Items per page dropdown
    // Pagination buttons
    // Expected: All items are available
    await expect(page.getByText(/All items are available/i).first()).toBeVisible();
  });

  test('S-002: Filter by skill', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByPlaceholder(/'Robot' in the skills filter/i).fill('value');
    // Expected: Robot Framework' skill should appear on the list
    await expect(page.getByText(/Robot Framework' skill should appear on the list/i).first()).toBeVisible();
  });

  test('S-003: Add Skill', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /'+Add a new skill'/i }).click();
    await page.getByPlaceholder(/name Test/i).fill('value');
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a type/i }).click();
    await page.getByPlaceholder(/Description/i).fill('value');
    await page.getByRole('button', { name: /'Create' button/i }).click();
    // Expected: New skill should be added to the list
    await expect(page.getByText(/New skill should be added to the list/i).first()).toBeVisible();
  });

  test('S-004: Edit Skill', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /the pencil icon to edit on the skill Test/i }).click();
    // Change name to Test2
    // Change skill type
    // Change description
    await page.getByRole('button', { name: /'Create button'/i }).click();
    await page.getByRole('button', { name: /the pencil icon to edit on the skill Test/i }).click();
    await page.getByRole('button', { name: /'Create' button/i }).click();
    // Expected: All fields should be edited
    await expect(page.getByText(/All fields should be edited/i).first()).toBeVisible();
  });

  test('S-005: Delete Skill', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /the trash icon to delete Skill Test/i }).click();
    // Expected: Skill gets deleted form the list
    await expect(page.getByText(/Skill gets deleted form the list/i).first()).toBeVisible();
  });

  test('S-006: Items per page', async ({ page }) => {
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

  test('S-007: Pagination buttons', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /pagination button 2/i }).click();
    await page.getByRole('button', { name: /pagination button 1/i }).click();
    // Expected: Records to navigate through pages
    await expect(page.getByText(/Records to navigate through pages/i).first()).toBeVisible();
  });

  test('S-008: Pagination then search back', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /pagination button 2/i }).click();
    // Filter by name using a skill in page 1
    await page.getByRole('button', { name: /pagination button 1/i }).click();
    // Expected: Team to show in the skills table and page navigates to the first page
    await expect(page.getByText(/Team to show in the skills table and page navigate/i).first()).toBeVisible();
  });
});
