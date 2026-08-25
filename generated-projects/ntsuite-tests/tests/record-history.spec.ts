import { test, expect } from '@playwright/test';
import { ensureAuthenticated, AUTH_ROLES } from '../utils/authHelper';

test.describe('Record History Module', () => {
  test.beforeEach(async ({ page }) => {
    // Navigation is handled per-test based on preconditions
  });

  test('RH-001: Items are available', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Evaluations').click();
    await expect(page.getByText(/the following items are available:/i).first()).toBeVisible();
    // Record History title
    // Clasification Legend:
    // 0 a 59 Deficient (D)
    // 60 a 69 Improvement (C)
    // 70 a 79 Good (B)
    // 80 a 89 Very Good (A)
    // 90 a 100 Excellent (A+)
    // Employee name, ID filter
    // Year filter
    // Record History table with columns: Employee ID, Name, Position, Supervisor, Average, Calification
    // Items per page dropdown
    // Pagination buttons
    // Expected: Items are available
    await expect(page.getByText(/Items are available/i).first()).toBeVisible();
  });

  test('RH-002: Filter by name', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Evaluations').click();
    await page.getByPlaceholder(/'ABEL' in the name filter/i).fill('value');
    // Expected: Employee Abel shows in the records history table
    await expect(page.getByText(/Employee Abel shows in the records history table/i).first()).toBeVisible();
  });

  test('RH-003: Filter by employee ID', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Evaluations').click();
    await page.getByPlaceholder(/'6047' in the employee ID filter/i).fill('value');
    // Expected: Employee Abel shows in the records history table
    await expect(page.getByText(/Employee Abel shows in the records history table/i).first()).toBeVisible();
  });

  test('RH-004: Filter by year', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Evaluations').click();
    await page.getByPlaceholder(/'2025' in the year filter/i).fill('value');
    // Expected: Records history table shows only evaluations from 2025
    await expect(page.getByText(/Records history table shows only evaluations from /i).first()).toBeVisible();
  });

  test('RH-005: Open evaluation history details', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Evaluations').click();
    // Open the first employee in the records history table
    // Expected: All sections are displayed for each quarter
    await expect(page.getByText(/All sections are displayed for each quarter/i).first()).toBeVisible();
  });

  test('RH-006: Items per page', async ({ page }) => {
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

  test('RH-007: Pagination buttons', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Evaluations').click();
    await page.getByRole('button', { name: /pagination button 2/i }).click();
    await page.getByRole('button', { name: /pagination button 1/i }).click();
    // Expected: Records to navigate through pages
    await expect(page.getByText(/Records to navigate through pages/i).first()).toBeVisible();
  });
});
