import { test, expect } from '@playwright/test';
import { ensureAuthenticated, AUTH_ROLES } from '../utils/authHelper';

test.describe('Notifications Module', () => {
  test.beforeEach(async ({ page }) => {
    // Navigation is handled per-test based on preconditions
  });

  test('N-001: Notification window items', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByRole('button', { name: /bell icon/i }).click();
    await expect(page.getByText(/the following items are available:/i).first()).toBeVisible();
    // Refresh button
    // Notifications button
    // Close window button
    // All tab
    // Unread tab
    // Read Tab
    // Filter searchbar
    // Filter button
    await page.getByRole('button', { name: /settings button/i }).click();
    await expect(page.getByText(/the following items are available:/i).first()).toBeVisible();
    // Close notifications button
    // Close window button
    // Timesheets tab
    // Employee Changes tab
    // Tickets tab
    // Timesheet comments slider
    // Timesheet comments radio buttons
    // Timesheet movements slider
    // Timesheet movements radiobuttons
    // Timesheet rejects slider
    // Timesheet rejects radiobuttons
    await page.getByRole('button', { name: /Employee Changes/i }).click();
    await expect(page.getByText(/the following items are available:/i).first()).toBeVisible();
    // Employee reporting  slider
    // Employee reporting radiobuttons
    // Employee inactive slider
    // Employee inactive radiobuttons
    // Employee statis slider
    // Employee status radiobuttons
    await page.getByRole('button', { name: /Tickets/i }).click();
    await expect(page.getByText(/the following items are available/i).first()).toBeVisible();
    // Vacation Tickets Approved slider
    // Vacation Tickets Approved radiobuttons
    // Vacation Tickets Submitted slider
    // Vacation Tickets Submitted radiobuttons
    // Expected: Items are available and can be interacted with
    await expect(page.getByText(/Items are available and can be interacted with/i).first()).toBeVisible();
  });

  test('N-002: Filter notifications', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByRole('button', { name: /the bell icon/i }).click();
    await page.getByPlaceholder(/''Comment on the notification filter/i).fill('value');
    // Expected: All comment notifications are filtered in the list
    await expect(page.getByText(/All comment notifications are filtered in the list/i).first()).toBeVisible();
  });

  test('N-003: Notification settings', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByRole('button', { name: /the bell icon/i }).click();
    await page.getByRole('button', { name: /the gear icon in the notification window/i }).click();
    // Expected: Notification configuration window should be displayed with timesheets, employee changes and Tickets tab
    await expect(page.getByText(/Notification configuration window should be displa/i).first()).toBeVisible();
  });

  test('N-004: Timesheet comments notification received', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByRole('button', { name: /the bell icon/i }).click();
    await page.getByRole('button', { name: /the gear icon/i }).click();
    await page.getByRole('button', { name: /timesheets tab/i }).click();
    // Activate the Timesheet comments checkbox
    await page.getByText('List of Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Timesheet/i }).click();
    await page.getByText('comments section').click();
    // Add a comment
    // Expected: A notification for the new comment should be received
    await expect(page.getByText(/A notification for the new comment should be recei/i).first()).toBeVisible();
  });

  test('N-005: Timesheet comments notification not received', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByRole('button', { name: /the bell icon/i }).click();
    await page.getByRole('button', { name: /the gear icon/i }).click();
    await page.getByRole('button', { name: /timesheets tab/i }).click();
    // Deactivate the Timesheet comments checkbox
    await page.getByText('List of Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Timesheet/i }).click();
    await page.getByText('comments section').click();
    // Add a comment
    // Expected: A notification for the new comment should not be received
    await expect(page.getByText(/A notification for the new comment should not be r/i).first()).toBeVisible();
  });

  test('N-006: Timesheet movements notification received', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByRole('button', { name: /the bell icon/i }).click();
    await page.getByRole('button', { name: /the gear icon/i }).click();
    await page.getByRole('button', { name: /timesheets tab/i }).click();
    // Activate the Timesheet movements checkbox
    await page.getByText('List of Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Timesheet/i }).click();
    // Move timesheet to in review
    // Expected: A notification for the timesheet movement should be received
    await expect(page.getByText(/A notification for the timesheet movement should b/i).first()).toBeVisible();
  });

  test('N-007: Timesheet movements notification not received', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByRole('button', { name: /the bell icon/i }).click();
    await page.getByRole('button', { name: /the gear icon/i }).click();
    await page.getByRole('button', { name: /timesheets tab/i }).click();
    // Deactivate the Timesheet movements checkbox
    await page.getByText('List of Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Timesheet/i }).click();
    // Move timesheet to in review
    // Expected: A notification for the timesheet movement should not be received
    await expect(page.getByText(/A notification for the timesheet movement should n/i).first()).toBeVisible();
  });

  test('N-008: Timesheet rejects notification received', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByRole('button', { name: /the bell icon/i }).click();
    await page.getByRole('button', { name: /the gear icon/i }).click();
    await page.getByRole('button', { name: /timesheets tab/i }).click();
    // Activate the Timesheet rejects checkbox
    await page.getByText('List of Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Timesheet in review/i }).click();
    // Reject the timesheet with a comment
    // Expected: A notification for the timesheet reject should be received
    await expect(page.getByText(/A notification for the timesheet reject should be /i).first()).toBeVisible();
  });

  test('N-009: Timesheet rejects notification not received', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByRole('button', { name: /the bell icon/i }).click();
    await page.getByRole('button', { name: /the gear icon/i }).click();
    await page.getByRole('button', { name: /timesheets tab/i }).click();
    // Deactivate the Timesheet rejects checkbox
    await page.getByText('List of Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Timesheet in review/i }).click();
    // Reject the timesheet with a comment
    // Expected: A notification for the timesheet reject should not be received
    await expect(page.getByText(/A notification for the timesheet reject should not/i).first()).toBeVisible();
  });

  test('N-010: Employee Reporting notification received', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);

    // Expected: 
    await expect(page.getByText(//i).first()).toBeVisible();
  });

  test('N-012: Employee Inactive notification received', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByRole('button', { name: /the bell icon/i }).click();
    await page.getByRole('button', { name: /the gear icon/i }).click();
    await page.getByRole('button', { name: /Employee changes tab/i }).click();
    // Activate the employee inactive checkbox
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /the deactivate employee button for an employee/i }).click();
    // Expected: A notification for the employee deactivated should be received
    await expect(page.getByText(/A notification for the employee deactivated should/i).first()).toBeVisible();
  });

  test('N-013: Employee Inactive notification not received', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByRole('button', { name: /the bell icon/i }).click();
    await page.getByRole('button', { name: /the gear icon/i }).click();
    await page.getByRole('button', { name: /Employee changes tab/i }).click();
    // Deactivate the employee inactive checkbox
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /the deactivate employee button for an employee/i }).click();
    // Expected: A notification for the employee deactivated should not be received
    await expect(page.getByText(/A notification for the employee deactivated should/i).first()).toBeVisible();
  });
});
