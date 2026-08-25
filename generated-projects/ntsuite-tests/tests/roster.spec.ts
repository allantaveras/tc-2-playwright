import { test, expect } from '@playwright/test';
import { ensureAuthenticated, AUTH_ROLES } from '../utils/authHelper';

test.describe('Roster Module', () => {
  test.beforeEach(async ({ page }) => {
    // Navigation is handled per-test based on preconditions
  });

  test('R-001: Items are available', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await expect(page.getByText(/the following items are available:/i).first()).toBeVisible();
    // Roster Management title
    // General and Bench Tab
    // General filter
    // Status filter
    // Supervisor filter
    // Team Filter
    // General employees table
    await page.getByRole('button', { name: /Bench tab/i }).click();
    await expect(page.getByText(/the following items are available:/i).first()).toBeVisible();
    // Bench search by name filter
    // Bench status filter
    // Table with benched employees
    // Items per page dropdown
    // pagination buttons
    // Expected: Items to be available
    await expect(page.getByText(/Items to be available/i).first()).toBeVisible();
  });

  test('R-002: Items are availabe in detailed view', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    // Employee name
    // Employee position
    // Employee status
    // Edit button
    // Full name
    // Phone
    // Email
    // Province
    // Start Date
    // Branch
    // Reports to
    // Employee positions section
    // Position name
    // Open date
    // Team
    // POC
    // Status
    // Daily time status section
    // Leaves and overtimewith dates hours and details
    // Employee skills section
    // Add skills/edit skills buttons
    // Skills listed with level
    // Skills legend
    // Comments section
    // Add comment button
    // Comments table
    // Expected: Items to be available
    await expect(page.getByText(/Items to be available/i).first()).toBeVisible();
  });

  test('R-003: Filter by name - General', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByPlaceholder(/an employee name in the general search bar/i).fill('value');
    // Expected: Employee is shown in employee table
    await expect(page.getByText(/Employee is shown in employee table/i).first()).toBeVisible();
  });

  test('R-004: Filter by last name - General', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByPlaceholder(/an employee last name in the general search bar/i).fill('value');
    // Expected: Employee is shown in employee table
    await expect(page.getByText(/Employee is shown in employee table/i).first()).toBeVisible();
  });

  test('R-005: Filter by full name - General', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByPlaceholder(/an employee full name in the general search bar/i).fill('value');
    // Expected: Employee is shown in employee table
    await expect(page.getByText(/Employee is shown in employee table/i).first()).toBeVisible();
  });

  test('R-006: Filter by Branch - General', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByPlaceholder(/a branch in the general search bar/i).fill('value');
    // Expected: All employees belong to the same branch
    await expect(page.getByText(/All employees belong to the same branch/i).first()).toBeVisible();
  });

  test('R-007: Filter by Employee ID - General', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByPlaceholder(/an employee ID in the general search bar/i).fill('value');
    // Expected: Employee is shown in employee table
    await expect(page.getByText(/Employee is shown in employee table/i).first()).toBeVisible();
  });

  test('R-008: Filter by status - General', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    // Set status filter to inactive
    // Expected: Inactive employees and no active employees are shown in the employee table
    await expect(page.getByText(/Inactive employees and no active employees are sho/i).first()).toBeVisible();
  });

  test('R-009: Filter by supervisor - General', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a supervisor in the supervisor filter/i }).click();
    // Expected: All employees are assigned to that supervisor
    await expect(page.getByText(/All employees are assigned to that supervisor/i).first()).toBeVisible();
  });

  test('R-010: Filter by Team - General', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Tean in the team filter/i }).click();
    // Expected: All employees are assigned to that team
    await expect(page.getByText(/All employees are assigned to that team/i).first()).toBeVisible();
  });

  test('R-011: Filter by name - Bench', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /Bench tab/i }).click();
    await page.getByPlaceholder(/a name in the general filter/i).fill('value');
    // Expected: Employee is shown in employee table
    await expect(page.getByText(/Employee is shown in employee table/i).first()).toBeVisible();
  });

  test('R-012: Filter by last name - Bench', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /Bench tab/i }).click();
    await page.getByPlaceholder(/a last name in the general filter/i).fill('value');
    // Expected: Employee is shown in employee table
    await expect(page.getByText(/Employee is shown in employee table/i).first()).toBeVisible();
  });

  test('R-013: Filter by full name - Bench', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /Bench tab/i }).click();
    await page.getByPlaceholder(/a full name in the general filter/i).fill('value');
    // Expected: Employee is shown in employee table
    await expect(page.getByText(/Employee is shown in employee table/i).first()).toBeVisible();
  });

  test('R-014: Filter by Employee ID - Bench', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /Bench tab/i }).click();
    await page.getByPlaceholder(/an employee ID in the general searchbar/i).fill('value');
    // Expected: Employee is shown in employee table
    await expect(page.getByText(/Employee is shown in employee table/i).first()).toBeVisible();
  });

  test('R-015: Filter by supervisor - Bench', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /Bench tab/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a supervisor in the supervisor filter/i }).click();
    // Expected: All employees are assigned to the chosen supervisor
    await expect(page.getByText(/All employees are assigned to the chosen superviso/i).first()).toBeVisible();
  });

  test('R-016: Edit employee', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /the pencil icon to edit the employee/i }).click();
    // Change name
    // Change Middle Name
    // Change Last Name
    // Change Second Last Name
    // Change Province
    // Change Employee code
    // Change Start Date
    // Change supervisor
    // Change Branch
    // Change phone number
    // Change email Address
    // Add a role
    await page.getByRole('button', { name: /Update button/i }).click();
    // Expected: All employee changes to be applied
    await expect(page.getByText(/All employee changes to be applied/i).first()).toBeVisible();
  });

  test('R-017: Edit invalid phone number', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /the pencil icon to edit the employee/i }).click();
    // Change name
    // Change Middle Name
    // Change Last Name
    // Change Second Last Name
    // Change Province
    // Change Employee code
    // Change Start Date
    // Change supervisor
    // Change Branch
    // Change phone number to have 8 digits
    // Change email Address
    // Add a role
    await page.getByRole('button', { name: /Update button/i }).click();
    // Expected: Error message to show asking for 10 digits
    await expect(page.getByText(/Error message to show asking for 10 digits/i).first()).toBeVisible();
  });

  test('R-018: Go to Team page', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /an employee/i }).click();
    // In employee positions, click the Team from that employee
    // Expected: Page is redirected to team page associated with that employee
    await expect(page.getByText(/Page is redirected to team page associated with th/i).first()).toBeVisible();
  });

  test('R-019: Add skill', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /the plus sign in skills section/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Skill Type/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Skill/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a level/i }).click();
    await page.getByRole('button', { name: /Save All skills button/i }).click();
    // Expected: Skill to be added to the profile
    await expect(page.getByText(/Skill to be added to the profile/i).first()).toBeVisible();
  });

  test('R-020: Add multiple skills', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /the plus sign in skills section/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /2 Skill Types/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /3 Skills/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a level for all of them/i }).click();
    await page.getByRole('button', { name: /Save All skills button/i }).click();
    // Expected: Skills to be added to the profile
    await expect(page.getByText(/Skills to be added to the profile/i).first()).toBeVisible();
  });

  test('R-021: Delete skill', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /the pencil icon in the skills section/i }).click();
    await page.getByRole('button', { name: /the trash icon to delete a skill/i }).click();
    // Expected: Skill to be deleted from profile
    await expect(page.getByText(/Skill to be deleted from profile/i).first()).toBeVisible();
  });

  test('R-022: Edit Skill level', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /the pencil icon in the skills section/i }).click();
    await page.getByRole('button', { name: /the pencil icon for a skill/i }).click();
    // Seleck a skill level
    // Expected: Skill level to be updated
    await expect(page.getByText(/Skill level to be updated/i).first()).toBeVisible();
  });

  test('R-023: Add an interview', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /Interviews tab/i }).click();
    await page.getByRole('button', { name: /Add an Interview/i }).click();
    await page.getByPlaceholder(/client/i).fill('value');
    await page.getByPlaceholder(/date/i).fill('value');
    await page.getByPlaceholder(/Status/i).fill('value');
    // Add a comment
    await page.getByRole('button', { name: /Add/i }).click();
    // Expected: Interview to be added to interview list
    await expect(page.getByText(/Interview to be added to interview list/i).first()).toBeVisible();
  });

  test('R-024: Edit an interview Client', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /Interviews tab/i }).click();
    await page.getByRole('button', { name: /pencil icon for an interview/i }).click();
    // Change client
    await page.getByRole('button', { name: /Update button/i }).click();
    // Expected: Client to be changed for the interview
    await expect(page.getByText(/Client to be changed for the interview/i).first()).toBeVisible();
  });

  test('R-025: Edit an interview Date', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /Interviews tab/i }).click();
    await page.getByRole('button', { name: /pencil icon for an interview/i }).click();
    // Change date
    await page.getByRole('button', { name: /Update button/i }).click();
    // Expected: Date to be changed for the interview
    await expect(page.getByText(/Date to be changed for the interview/i).first()).toBeVisible();
  });

  test('R-026: Edit an interview wih invalid Date', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /Interviews tab/i }).click();
    await page.getByRole('button', { name: /pencil icon for an interview/i }).click();
    // Change date to date in the future
    await page.getByRole('button', { name: /Update button/i }).click();
    // Expected: Message to show: Date cannot be in the future
    await expect(page.getByText(/Message to show: Date cannot be in the future/i).first()).toBeVisible();
  });

  test('R-027: Edit an interview Status', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /Interviews tab/i }).click();
    await page.getByRole('button', { name: /pencil icon for an interview/i }).click();
    // Change status
    await page.getByRole('button', { name: /Update button/i }).click();
    // Expected: Status to be changed for the interview
    await expect(page.getByText(/Status to be changed for the interview/i).first()).toBeVisible();
  });

  test('R-028: Edit an interview Comment', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /Interviews tab/i }).click();
    await page.getByRole('button', { name: /pencil icon for an interview/i }).click();
    // Change comment
    await page.getByRole('button', { name: /Update button/i }).click();
    // Expected: Comment to be changed for the interview
    await expect(page.getByText(/Comment to be changed for the interview/i).first()).toBeVisible();
  });

  test('R-029: Edit an interview Comment empty', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /Interviews tab/i }).click();
    await page.getByRole('button', { name: /pencil icon for an interview/i }).click();
    // Clear comment section
    await page.getByRole('button', { name: /Update button/i }).click();
    // Expected: Message to show: Updated comment cannot be empty
    await expect(page.getByText(/Message to show: Updated comment cannot be empty/i).first()).toBeVisible();
  });

  test('R-030: Delete an interview', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /Interviews tab/i }).click();
    await page.getByRole('button', { name: /the trash icon for an interview/i }).click();
    await page.getByRole('button', { name: /Delete button/i }).click();
    // Expected: Interview to be deleted from profile
    await expect(page.getByText(/Interview to be deleted from profile/i).first()).toBeVisible();
  });

  test('R-031: View interview details', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /Interviews tab/i }).click();
    await page.getByRole('button', { name: /the eye icon for an interview/i }).click();
    await expect(page.getByText(/the following items show correctly:/i).first()).toBeVisible();
    // Client
    // Interview Date
    // Interview Status
    // Comments
    // Expected: Interview Details to show correctly
    await expect(page.getByText(/Interview Details to show correctly/i).first()).toBeVisible();
  });

  test('R-032: Filter interview by date', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /Interviews tab/i }).click();
    // Search an interview by date using the filter
    // Expected: Only interviews with this date are shown in the interviews table
    await expect(page.getByText(/Only interviews with this date are shown in the in/i).first()).toBeVisible();
  });

  test('R-033: Filter interview by client', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /Interviews tab/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a client in the client dropdown/i }).click();
    // Expected: Only interviews with this client are shown in the interviews table
    await expect(page.getByText(/Only interviews with this client are shown in the /i).first()).toBeVisible();
  });

  test('R-034: Filter interview by status', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /Interviews tab/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a status in the status dropdown/i }).click();
    // Expected: Only interviews with this status are shown in the interviews table
    await expect(page.getByText(/Only interviews with this status are shown in the /i).first()).toBeVisible();
  });

  test('R-035: Filter status history with tab All', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /History tab/i }).click();
    await page.getByRole('button', { name: /the fillter icon/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /tab All/i }).click();
    // Expected: All movements from selected employee should appear
    await expect(page.getByText(/All movements from selected employee should appear/i).first()).toBeVisible();
  });

  test('R-036: Filter status history with tab Benched', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /History tab/i }).click();
    await page.getByRole('button', { name: /the filter icon/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /tab Benched/i }).click();
    // Expected: All movements from selected  employee in category bench should appear
    await expect(page.getByText(/All movements from selected  employee in category /i).first()).toBeVisible();
  });

  test('R-037: Filter status history with tab Active', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /History tab/i }).click();
    await page.getByRole('button', { name: /the fillter icon/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /tab Active/i }).click();
    // Expected: All movements from selected  employee in category active should appear
    await expect(page.getByText(/All movements from selected  employee in category /i).first()).toBeVisible();
  });

  test('R-038: Filter status history with tab Inactive', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /History tab/i }).click();
    await page.getByRole('button', { name: /the fillter icon/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /tab Inactive/i }).click();
    // Expected: All movements from selected  employee in category inactive should appear
    await expect(page.getByText(/All movements from selected  employee in category /i).first()).toBeVisible();
  });

  test('R-039: Filter status history by notes', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /the fillter icon/i }).click();
    await page.getByPlaceholder(/move in the notes filter/i).fill('value');
    // Expected: All movement with this word in the notes should appear
    await expect(page.getByText(/All movement with this word in the notes should ap/i).first()).toBeVisible();
  });

  test('R-040: Filter status history by notes and change author', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /the fillter icon/i }).click();
    await page.getByPlaceholder(/a in the notes filter/i).fill('value');
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an author/i }).click();
    // Expected: All movement with this word in the notes made by the selected author should appear
    await expect(page.getByText(/All movement with this word in the notes made by t/i).first()).toBeVisible();
  });

  test('R-041: Filter status history by change author and From date', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /History tab/i }).click();
    await page.getByRole('button', { name: /the filter icon/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an author/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /from date/i }).click();
    // Expected: All movements with this author and from this date should appear
    await expect(page.getByText(/All movements with this author and from this date /i).first()).toBeVisible();
  });

  test('R-042: Filter status history by change author and To date', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /History tab/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a change author/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a to date/i }).click();
    // Expected: All movements with this author and to date should appear
    await expect(page.getByText(/All movements with this author and to date should /i).first()).toBeVisible();
  });

  test('R-043: Filter status history by From date', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /History tab/i }).click();
    await page.getByRole('button', { name: /the filter icon/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a from date/i }).click();
    // Expected: All movements from this date should appear
    await expect(page.getByText(/All movements from this date should appear/i).first()).toBeVisible();
  });

  test('R-044: Filter status history by From and to date', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /History tab/i }).click();
    await page.getByRole('button', { name: /the filter icon/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /from date/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /to date/i }).click();
    // Expected: All movements from this date range should appear
    await expect(page.getByText(/All movements from this date range should appear/i).first()).toBeVisible();
  });

  test('R-045: Filter status history by From, to date and change author', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /History tab/i }).click();
    await page.getByRole('button', { name: /the filter icon/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /from date/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /to date/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /change author/i }).click();
    // Expected: All movements from this date range and change author should appear
    await expect(page.getByText(/All movements from this date range and change auth/i).first()).toBeVisible();
  });

  test('R-046: Filter status history by From, to date,change author and notes', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /History tab/i }).click();
    await page.getByRole('button', { name: /the filter icon/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /from date/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /to date/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /change author/i }).click();
    await page.getByPlaceholder(/'a' in the notes filter/i).fill('value');
    // Expected: All movements from this date range, with a in the notes and change author should appear
    await expect(page.getByText(/All movements from this date range, with a in the /i).first()).toBeVisible();
  });

  test('R-047: Clear status history filters', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /History tab/i }).click();
    await page.getByRole('button', { name: /the filter icon/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /from date/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /clear filters icon/i }).click();
    // Expected: List should reset to all entries
    await expect(page.getByText(/List should reset to all entries/i).first()).toBeVisible();
  });

  test('R-048: Items per page', async ({ page }) => {
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

  test('R-049: Pagination buttons', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /pagination button 2/i }).click();
    await page.getByRole('button', { name: /pagination button 1/i }).click();
    // Expected: Records to navigate through pages
    await expect(page.getByText(/Records to navigate through pages/i).first()).toBeVisible();
  });

  test('R-050: Pagination then search back', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /pagination button 2/i }).click();
    // Filter by name using a client in page 1
    await page.getByRole('button', { name: /pagination button 1/i }).click();
    // Expected: Team to show in the clients table and page navigates to the first page
    await expect(page.getByText(/Team to show in the clients table and page navigat/i).first()).toBeVisible();
  });
});
