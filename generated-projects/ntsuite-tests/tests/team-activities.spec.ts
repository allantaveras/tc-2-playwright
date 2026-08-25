import { test, expect } from '@playwright/test';
import { ensureAuthenticated, AUTH_ROLES } from '../utils/authHelper';

test.describe('Team Activities Module', () => {
  test.beforeEach(async ({ page }) => {
    // Navigation is handled per-test based on preconditions
  });

  test('M-001: Items are available', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Team Activities').click();
    await expect(page.getByText(/the following items are available:/i).first()).toBeVisible();
    // My team activites title
    // Year filter
    // Month filter
    // Apply filters button
    // View my team button
    // Set year filter to 2025, month filter to november and click on apply filter button
    await expect(page.getByText(/the following items are available:/i).first()).toBeVisible();
    // November 2025 text and description
    // Expected Hours
    // Logged Hours
    // Employee count
    // Extra hours count
    // Time-Off count
    // Team leave overview tab
    // Overtime/time off tab
    // Period comments tab
    // +New button
    // Displaying data from text
    // Expected: Items are available
    await expect(page.getByText(/Items are available/i).first()).toBeVisible();
  });

  test('M-002: Add medical leave', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Team Activities').click();
    // Set year filter to 2025, month filter to november and click on apply filter button
    await page.getByRole('button', { name: /New+ button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee in the team/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /leave type Medical leave/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a leave period/i }).click();
    await page.getByPlaceholder(/details/i).fill('value');
    await page.getByRole('button', { name: /save leave/i }).click();
    // Expected: New medical leave should be added to the team leaves list
    await expect(page.getByText(/New medical leave should be added to the team leav/i).first()).toBeVisible();
  });

  test('M-003: Add family death', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Team Activities').click();
    // Set year filter to 2025, month filter to november and click on apply filter button
    await page.getByRole('button', { name: /New+ button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee in the team/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /leave type family death/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a leave period/i }).click();
    await page.getByPlaceholder(/details/i).fill('value');
    await page.getByRole('button', { name: /save leave/i }).click();
    // Expected: New family death leave should be added to the list
    await expect(page.getByText(/New family death leave should be added to the list/i).first()).toBeVisible();
  });

  test('M-004: Add maternity leave', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Team Activities').click();
    // Set year filter to 2025, month filter to november and click on apply filter button
    await page.getByRole('button', { name: /New+ button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee in the team/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /leave type maternity/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a leave period/i }).click();
    await page.getByPlaceholder(/details/i).fill('value');
    await page.getByRole('button', { name: /save leave/i }).click();
    // Expected: New maternity leave should be added to the list
    await expect(page.getByText(/New maternity leave should be added to the list/i).first()).toBeVisible();
  });

  test('M-005: Add paternity leave', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Team Activities').click();
    // Set year filter to 2025, month filter to november and click on apply filter button
    await page.getByRole('button', { name: /New+ button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee in the team/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /leave type paternity/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a leave period/i }).click();
    await page.getByPlaceholder(/details/i).fill('value');
    await page.getByRole('button', { name: /save leave/i }).click();
    // Expected: New paternity leave should be added to the list
    await expect(page.getByText(/New paternity leave should be added to the list/i).first()).toBeVisible();
  });

  test('M-006: Add vacation', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Team Activities').click();
    // Set year filter to 2025, month filter to november and click on apply filter button
    await page.getByRole('button', { name: /New+ button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee in the team/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /leave type vacation/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a leave period/i }).click();
    await page.getByPlaceholder(/details/i).fill('value');
    await page.getByRole('button', { name: /save leave/i }).click();
    // Expected: New vacation leave should be added to the list
    await expect(page.getByText(/New vacation leave should be added to the list/i).first()).toBeVisible();
  });

  test('M-007: Add overtime for Production Deployment', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Team Activities').click();
    // Set year filter to 2025, month filter to november and click on apply filter button
    await page.getByRole('button', { name: /Overtime/time off overview button/i }).click();
    await page.getByRole('button', { name: /+New button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a date/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /From Time/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /To time/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /Details Production deployment/i }).click();
    // Expected: New overtime for production deployment should be added
    await expect(page.getByText(/New overtime for production deployment should be a/i).first()).toBeVisible();
  });

  test('M-008: Add overtime for Bug fixing', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Team Activities').click();
    // Set year filter to 2025, month filter to november and click on apply filter button
    await page.getByRole('button', { name: /Overtime/time off overview button/i }).click();
    await page.getByRole('button', { name: /+New button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a date/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /From Time graveyard hours/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /To time graveyard hours/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /Details Bug fixing/i }).click();
    // Expected: New overtime for bug fixing should be added
    await expect(page.getByText(/New overtime for bug fixing should be added/i).first()).toBeVisible();
  });

  test('M-009: Add overtime for Client request', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Team Activities').click();
    // Set year filter to 2025, month filter to november and click on apply filter button
    await page.getByRole('button', { name: /Overtime/time off overview button/i }).click();
    await page.getByRole('button', { name: /+New button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a date/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /From Time/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /To time/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /Details Client request/i }).click();
    // Expected: New overtime for client request should be added
    await expect(page.getByText(/New overtime for client request should be added/i).first()).toBeVisible();
  });

  test('M-010: Add overtime for Holiday-Customer support', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Team Activities').click();
    // Set year filter to 2025, month filter to november and click on apply filter button
    await page.getByRole('button', { name: /Overtime/time off overview button/i }).click();
    await page.getByRole('button', { name: /+New button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a date/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /From Time/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /To time/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /Details Holiday-Customer support/i }).click();
    // Expected: New overtime for Holiday-Customer support should be added
    await expect(page.getByText(/New overtime for Holiday-Customer support should b/i).first()).toBeVisible();
  });

  test('M-011: Add time off', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Team Activities').click();
    // Set year filter to 2025, month filter to november and click on apply filter button
    await page.getByRole('button', { name: /Overtime/time off overview button/i }).click();
    await page.getByRole('button', { name: /+New button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a date/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /type Time off/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /From Time/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /to time/i }).click();
    // Expected: New time off should be added
    await expect(page.getByText(/New time off should be added/i).first()).toBeVisible();
  });

  test('M-012: Add comment', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Team Activities').click();
    // Set year filter to 2025, month filter to november and click on apply filter button
    await page.getByRole('button', { name: /Period comments button/i }).click();
    await page.getByRole('button', { name: /+New button/i }).click();
    // Add a comment
    await page.getByRole('button', { name: /submit/i }).click();
    // Expected: New comment should be added to the list
    await expect(page.getByText(/New comment should be added to the list/i).first()).toBeVisible();
  });

  test('M-013: Edit comment', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Team Activities').click();
    // Set year filter to 2025, month filter to november and click on apply filter button
    await page.getByRole('button', { name: /Period comments button/i }).click();
    await page.getByRole('button', { name: /the pencil icon to edit a comment/i }).click();
    // Modify the comment
    await page.getByRole('button', { name: /submit/i }).click();
    // Expected: Comment should be updated with modifications
    await expect(page.getByText(/Comment should be updated with modifications/i).first()).toBeVisible();
  });
});
