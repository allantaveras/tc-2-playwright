import { test, expect } from '@playwright/test';
import { ensureAuthenticated, AUTH_ROLES } from '../utils/authHelper';

test.describe('Benched Employees Module', () => {
  test.beforeEach(async ({ page }) => {
    // Navigation is handled per-test based on preconditions
  });

  test('B-001: Items are available', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Team Activities').click();
    await expect(page.getByText(/the following items are available:/i).first()).toBeVisible();
    // Bench Management Dashboard title
    // General search filter
    // Branch filter
    // Employee ID filter
    // View my team button
    // Apply filters button
    // Employees table
    // Items per page dropdown
    // Pagination buttons
    // Expected: Items are available
    await expect(page.getByText(/Items are available/i).first()).toBeVisible();
  });

  test('B-002: Items are availabe in detailed view', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Team Activities').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /employee Abel Mota/i }).click();
    await expect(page.getByText(/the following items are available:/i).first()).toBeVisible();
    // Employee first name and last name
    // Employee ID
    // Employee full name
    // Employee phone number
    // Employee email
    // Employee province
    // Employee start date
    // Employee benched time
    // Edit user button
    // Employee skills section
    // Skills listed
    // Employee leaves section
    // Leave details
    // Expected: Items are available
    await expect(page.getByText(/Items are available/i).first()).toBeVisible();
  });

  test('B-003: Filter by name', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Maintenance').click();
    await page.getByPlaceholder(/Abel in the search by name filter/i).fill('value');
    // Expected: Employee should show on the list
    await expect(page.getByText(/Employee should show on the list/i).first()).toBeVisible();
  });

  test('B-004: Filter by branch', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /branch ''NT'' in the branch filter/i }).click();
    // Expected: Only employees with branch NT should show
    await expect(page.getByText(/Only employees with branch NT should show/i).first()).toBeVisible();
  });

  test('B-005: Filter by employee ID', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee ID from the Employee ID filter/i }).click();
    // Expected: Only the employee with this employee ID should show
    await expect(page.getByText(/Only the employee with this employee ID should sho/i).first()).toBeVisible();
  });

  test('B-006: Filter by branch and name', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Maintenance').click();
    await page.getByPlaceholder(/Abel in the search by name filter/i).fill('value');
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /branch ''NT'' in the branch filter/i }).click();
    // Expected: Only employees with branch NT and name Abel should show
    await expect(page.getByText(/Only employees with branch NT and name Abel should/i).first()).toBeVisible();
  });

  test('B-007: Edit employee', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee on the list/i }).click();
    await page.getByRole('button', { name: /Edit User button/i }).click();
    // Change province
    // Change phone number
    // Change email
    // Expected: All changes should be reflected
    await expect(page.getByText(/All changes should be reflected/i).first()).toBeVisible();
  });

  test('B-008: Edit employee with invalid phone number', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee on the list/i }).click();
    await page.getByRole('button', { name: /Edit User button/i }).click();
    // Change phone number with 8 digits
    // Expected: System should not accept the phone number
    await expect(page.getByText(/System should not accept the phone number/i).first()).toBeVisible();
  });

  test('B-009: Edit leave', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee on the list/i }).click();
    await page.getByText('leaves section').click();
    await page.getByRole('button', { name: /the pencil to edit a leave/i }).click();
    // Change leave period
    // Expected: Changes should be reflected
    await expect(page.getByText(/Changes should be reflected/i).first()).toBeVisible();
  });

  test('B-010: Delete leave', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee on the list/i }).click();
    await page.getByText('leaves section').click();
    await page.getByRole('button', { name: /the trash icon to delete a leave/i }).click();
    await page.getByRole('button', { name: /delete button/i }).click();
    // Expected: Leave should be deleted
    await expect(page.getByText(/Leave should be deleted/i).first()).toBeVisible();
  });

  test('B-011: Items per page', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Team activities').click();
    await expect(page.getByText(/table shows 10 items/i).first()).toBeVisible();
    // Change Items per page to '20'
    await expect(page.getByText(/table shows 20 items/i).first()).toBeVisible();
    // Change Items per page to '50'
    await expect(page.getByText(/table shows 50 items/i).first()).toBeVisible();
    // Expected: Table to adjust ammount of records apropiately
    await expect(page.getByText(/Table to adjust ammount of records apropiately/i).first()).toBeVisible();
  });

  test('B-012: Pagination buttons', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Team activities').click();
    await page.getByRole('button', { name: /pagination button 2/i }).click();
    await page.getByRole('button', { name: /pagination button 1/i }).click();
    // Expected: Records to navigate through pages
    await expect(page.getByText(/Records to navigate through pages/i).first()).toBeVisible();
  });
});
