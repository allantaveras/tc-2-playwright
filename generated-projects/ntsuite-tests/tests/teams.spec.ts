import { test, expect } from '@playwright/test';
import { ensureAuthenticated, AUTH_ROLES } from '../utils/authHelper';

test.describe('Teams Module', () => {
  test.beforeEach(async ({ page }) => {
    // Navigation is handled per-test based on preconditions
  });

  test('T-001: Items are available', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await expect(page.getByText(/the following items are available:/i).first()).toBeVisible();
    // Team management title is available
    // +Add a new team button
    // Team name filter
    // Status Filter
    // Teams table
    // Items per page
    // Pagination buttons
    // Expected: Items to be available
    await expect(page.getByText(/Items to be available/i).first()).toBeVisible();
  });

  test('T-002: Detailed view items are available', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /a Team/i }).click();
    await expect(page.getByText(/the following items are available:/i).first()).toBeVisible();
    // Team name
    // Client
    // Edit team button
    // Search employee or position filter
    // +Add position button
    // Position occupation section
    // Expected: Items to be available
    await expect(page.getByText(/Items to be available/i).first()).toBeVisible();
  });

  test('T-003: Create Team', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /+Add a new Team/i }).click();
    await page.getByPlaceholder(/team name textbox/i).fill('value');
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /client/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /owner/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Team Poc/i }).click();
    await page.getByPlaceholder(/Max Occupation/i).fill('value');
    await page.getByRole('button', { name: /Save button/i }).click();
    // Expected: New team to be created
    await expect(page.getByText(/New team to be created/i).first()).toBeVisible();
  });

  test('T-004: Create team with empty client', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /+Add a new Team/i }).click();
    await page.getByPlaceholder(/team name textbox/i).fill('value');
    // Leave the client dropdown empty
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /owner/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Team Poc/i }).click();
    await page.getByPlaceholder(/Max Occupation/i).fill('value');
    await page.getByRole('button', { name: /Save button/i }).click();
    // Expected: Team to be created with "No client assigned"
    await expect(page.getByText(/Team to be created with "No client assigned"/i).first()).toBeVisible();
  });

  test('T-005: Create team with negative max occupation', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /+Add a new Team/i }).click();
    await page.getByPlaceholder(/team name textbox/i).fill('value');
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a client/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /owner/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Team Poc/i }).click();
    await page.getByPlaceholder(/a negative Max Occupation/i).fill('value');
    await page.getByRole('button', { name: /Save button/i }).click();
    // Expected: Team not to be created and message to show up
    await expect(page.getByText(/Team not to be created and message to show up/i).first()).toBeVisible();
  });

  test('T-006: Create team excluded from timesheet', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /+Add a new Team/i }).click();
    await page.getByPlaceholder(/team name textbox/i).fill('value');
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a client/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /owner/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Team Poc/i }).click();
    await page.getByPlaceholder(/Max Occupation/i).fill('value');
    // Check the status checkbox
    await page.getByRole('button', { name: /Save button/i }).click();
    // Expected: Team to be created with active status
    await expect(page.getByText(/Team to be created with active status/i).first()).toBeVisible();
  });

  test('T-007: Create an inactive team', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('"1.  Maintenance').click();
    await page.getByRole('button', { name: /+Add a new Team/i }).click();
    await page.getByPlaceholder(/team name textbox/i).fill('value');
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a client/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /owner/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Team Poc/i }).click();
    await page.getByPlaceholder(/Max Occupation/i).fill('value');
    // Uncheck the status checkbox
    await page.getByRole('button', { name: /Save button/i }).click();
    // Expected: Team to be created with inactive status
    await expect(page.getByText(/Team to be created with inactive status/i).first()).toBeVisible();
  });

  test('T-008: Edit team POC', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /a team's record/i }).click();
    await page.getByRole('button', { name: /Edit Team/i }).click();
    // Change Team Name
    // Change Client
    // Change POC(Manager)
    // Change Local POC
    // Change Max Approved Positions
    // Change Status
    // Change Include in Timesheet
    await page.getByRole('button', { name: /Update Team button/i }).click();
    // Expected: Team to show the changes
    await expect(page.getByText(/Team to show the changes/i).first()).toBeVisible();
  });

  test('T-009: Edit team with empty client', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /a team's record/i }).click();
    await page.getByRole('button', { name: /Edit Team/i }).click();
    // Change Team Name
    // Leave the client name empty
    await page.getByRole('button', { name: /Update Team/i }).click();
    // Expected: Pop-up tells you to fill out the client field
    await expect(page.getByText(/Pop-up tells you to fill out the client field/i).first()).toBeVisible();
  });

  test('T-010: Edit team with negative  max occupation', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /a team's record/i }).click();
    await page.getByRole('button', { name: /Edit Team/i }).click();
    // Change Team Name
    // Change Client
    // Change POC(Manager)
    // Change Local POC
    // Change Max Approved Positions to a negative number
    // Change Status
    // Change Include in Timesheet
    await page.getByRole('button', { name: /Update Team button/i }).click();
    // Expected: Form to throw an error message
    await expect(page.getByText(/Form to throw an error message/i).first()).toBeVisible();
  });

  test('T-011: Edit Team excluded from timesheet', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /a team's record/i }).click();
    await page.getByRole('button', { name: /Edit Team/i }).click();
    // Uncheck the excluded from timesheet checkbox
    await page.getByRole('button', { name: /Update Team/i }).click();
    await page.getByText('List of Timesheets').click();
    // Generate Timesheets for next month
    // Look for Edited team
    // Expected: Team not to show in newly generated timesheets
    await expect(page.getByText(/Team not to show in newly generated timesheets/i).first()).toBeVisible();
  });

  test('T-012: Edit Team with status inactive', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /a team's record/i }).click();
    await page.getByRole('button', { name: /Edit Team/i }).click();
    // Uncheck the status to inactive
    await page.getByRole('button', { name: /Update Team/i }).click();
    // Search for Team status to be inactive
    // Expected: Team to change to Inactive status
    await expect(page.getByText(/Team to change to Inactive status/i).first()).toBeVisible();
  });

  test('T-013: Filter by name', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    // Search for a team using the team name filter
    // Expected: Team to show on the Teams table
    await expect(page.getByText(/Team to show on the Teams table/i).first()).toBeVisible();
  });

  test('T-014: Filter by status', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    // Set the status filter to inactive
    await expect(page.getByText(/only active teams show/i).first()).toBeVisible();
    // Set the status filter to inactive
    // Expected: Only inactive teams show on the teams table
    await expect(page.getByText(/Only inactive teams show on the teams table/i).first()).toBeVisible();
  });

  test('T-015: Filter by employee in team', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /a team/i }).click();
    // Search for an employee using search by employee filter
    await expect(page.getByText(/filtration/i).first()).toBeVisible();
    // Expected: Searched employee is shown on the list
    await expect(page.getByText(/Searched employee is shown on the list/i).first()).toBeVisible();
  });

  test('T-016: Filter by position in team', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /a team/i }).click();
    // Search for an employee with position using search by employee or position filter
    await expect(page.getByText(/filtration/i).first()).toBeVisible();
    // Expected: Searched position is shown in the list
    await expect(page.getByText(/Searched position is shown in the list/i).first()).toBeVisible();
  });

  test('T-017: Position occupation bar 10%', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /a Team/i }).click();
    // Add or adjust to 10% of the max occupation in employees
    // Expected: Bar is updated to show 10% occupation
    await expect(page.getByText(/Bar is updated to show 10% occupation/i).first()).toBeVisible();
  });

  test('T-018: Position occupation bar 50%', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /a Team/i }).click();
    // Add or adjust to 50% of the max occupation in employees
    // Expected: Bar is updated to show 50% occupation
    await expect(page.getByText(/Bar is updated to show 50% occupation/i).first()).toBeVisible();
  });

  test('T-019: Position occupation bar 100%', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /a Team/i }).click();
    // Add or adjust to 100% of the max occupation in employees
    // Expected: Bar is updated to show 100% occupation
    await expect(page.getByText(/Bar is updated to show 100% occupation/i).first()).toBeVisible();
  });

  test('T-020: Open employee in team', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /a Team/i }).click();
    await page.getByRole('button', { name: /the Open button for the first employee in the team/i }).click();
    // Expected: Page is redirected to Roster details for that employee
    await expect(page.getByText(/Page is redirected to Roster details for that empl/i).first()).toBeVisible();
  });

  test('T-021: Reassign employee in team', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /a Team/i }).click();
    await page.getByRole('button', { name: /the reassign icon for the first employee in the team/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Team/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Position/i }).click();
    await page.getByRole('button', { name: /Next/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Supervisor/i }).click();
    await page.getByRole('button', { name: /Next/i }).click();
    // Leave dates as is
    await page.getByRole('button', { name: /Next/i }).click();
    await expect(page.getByText(/the following Items are visible:/i).first()).toBeVisible();
    // Employee
    // From Date
    // To Date
    // Supervisor
    // Transition Date
    await page.getByRole('button', { name: /Confirm Reassigment/i }).click();
    // Expected: Employee is removed from the team and added to the new one
    await expect(page.getByText(/Employee is removed from the team and added to the/i).first()).toBeVisible();
  });

  test('T-022: Reassign employee in team with invalid dates', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /a Team/i }).click();
    await page.getByRole('button', { name: /the reassign icon for the first employee in the team/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Team/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Position/i }).click();
    await page.getByRole('button', { name: /Next/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Supervisor/i }).click();
    await page.getByRole('button', { name: /Next/i }).click();
    // Change future datepicker with a date in the past
    await page.getByRole('button', { name: /Next/i }).click();
    await expect(page.getByText(/the following Items are visible:/i).first()).toBeVisible();
    // Employee
    // From Date
    // To Date
    // Supervisor
    // Transition Date
    await page.getByRole('button', { name: /Confirm Reassigment/i }).click();
    // Expected: Error is shown preventing the move with invalid dates
    await expect(page.getByText(/Error is shown preventing the move with invalid da/i).first()).toBeVisible();
  });

  test('T-023: Edit position name in team', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /a Team/i }).click();
    await page.getByRole('button', { name: /pencil icon for the first employee in the list/i }).click();
    // Edit position title
    await expect(page.getByText(/status, Team and Employee fields/i).first()).toBeVisible();
    await page.getByRole('button', { name: /Save Position button/i }).click();
    // Expected: Position is renamed
    await expect(page.getByText(/Position is renamed/i).first()).toBeVisible();
  });

  test('T-024: Close position', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /a Team/i }).click();
    await page.getByRole('button', { name: /pencil icon for the first employee in the list/i }).click();
    // Edit position status to Closed
    await page.getByRole('button', { name: /Save Position button/i }).click();
    await page.getByText('List of timesheets').click();
    // Generate timesheets for next month
    // Expected: Position is removed from the list and does not show in the new timesheet
    await expect(page.getByText(/Position is removed from the list and does not sho/i).first()).toBeVisible();
  });

  test('T-025: Change position start date', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /a Team/i }).click();
    await page.getByRole('button', { name: /pencil icon for the first employee in the list/i }).click();
    // Edit position dates to a date before
    await page.getByRole('button', { name: /Save Position button/i }).click();
    // Expected: Position date is edited and shows in the new period
    await expect(page.getByText(/Position date is edited and shows in the new perio/i).first()).toBeVisible();
  });

  test('T-026: Assign as buffer employee', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /a Team/i }).click();
    // Check the buffer checkbox for an employee
    // Create a leave for an employee
    await page.getByText('list of timesheets').click();
    // Generate timesheets for that period
    // Expected: Vacations are covered by the employee in buffer
    await expect(page.getByText(/Vacations are covered by the employee in buffer/i).first()).toBeVisible();
  });

  test('T-027: Unassign as buffer employee', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /a Team/i }).click();
    // Unheck the buffer checkbox for an employee
    // Create a leave for an employee
    await page.getByText('list of timesheets').click();
    // Generate timesheets for that period
    // Expected: Vacations are not covered by the employee removed from buffer
    await expect(page.getByText(/Vacations are not covered by the employee removed /i).first()).toBeVisible();
  });

  test('T-028: Items per page', async ({ page }) => {
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

  test('T-029: Pagination buttons', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /pagination button 2/i }).click();
    await page.getByRole('button', { name: /pagination button 1/i }).click();
    // Expected: Records to navigate through pages
    await expect(page.getByText(/Records to navigate through pages/i).first()).toBeVisible();
  });

  test('T-030: Pagination then search back', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.hr.file, AUTH_ROLES.hr.username, AUTH_ROLES.hr.password);
    await page.getByText('Maintenance').click();
    await page.getByRole('button', { name: /pagination button 2/i }).click();
    // Filter by name using a client in page 1
    await page.getByRole('button', { name: /pagination button 1/i }).click();
    // Expected: Team to show in the clients table and page navigates to the first page
    await expect(page.getByText(/Team to show in the clients table and page navigat/i).first()).toBeVisible();
  });

  test('T-001: Items are available', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await expect(page.getByText(/the following items are available:/i).first()).toBeVisible();
    // Timesheet periods title
    // Search by team filter
    // Search by poc filter
    // Search by year filter
    // Search by month filter
    // Search by status filter
    // Search by type filter
    // +Generate timesheet button
    // Timesheets table
    // Items per page dropdown
    // Pagination buttons
    // Expected: Items are available
    await expect(page.getByText(/Items are available/i).first()).toBeVisible();
  });

  test('T-002: Items are availabe single timesheet', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    // Open a single timesheet
    await expect(page.getByText(/the following items are available:/i).first()).toBeVisible();
    // Single timesheet detailed view
    // Timesheet tam name
    // Timesheet POC with mm/yy period
    // Refresh button
    // Regenerate timesheet button
    // ''+" New activity button
    // Move timesheet button
    // Expected hours count
    // Logged hours count
    // Employees count
    // Extra hours count
    // Time-off count
    // Overview tab
    // Employee name filter
    // Min hours filter
    // Max hours filter
    // Download button
    // Employee list
    // Overtime and timeoff tab
    // Overtime details by team and employees
    // Leave details by team and employees
    // Status change history tab
    // Timesheet status
    // Status progression bar
    // Period comments tab
    // New comment button
    // Comments list
    // Expected: Items are available
    await expect(page.getByText(/Items are available/i).first()).toBeVisible();
  });

  test('T-003: Items are availabe unified timesheet', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    // Open an unified timesheet
    await expect(page.getByText(/the following items are available:/i).first()).toBeVisible();
    // unified timesheet detailed view
    // Timesheet tam name
    // Unified timesheet icon
    // Timesheet POC with mm/yy period
    // Refresh button
    // Regenerate timesheet button
    // ''+" New activity button
    // Move timesheet button
    // Expected hours count
    // Logged hours count
    // Employees count
    // Extra hours count
    // Time-off count
    // Overview tab
    // Team selector
    // Employee name filter
    // Min hours filter
    // Max hours filter
    // Download button
    // Employee list
    // Overtime and timeoff tab
    // Team selector
    // Overtime details by team and employees
    // Leave details by team and employees
    // Status change history tab
    // Timesheet status
    // Status progression bar
    // Period comments tab
    // New comment button
    // Comments list
    // Expected: Items are available
    await expect(page.getByText(/Items are available/i).first()).toBeVisible();
  });

  test('T-004: Filter by team', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByPlaceholder(/STARB in search by team filter/i).fill('value');
    // Expected: Only STARB timesheets should show
    await expect(page.getByText(/Only STARB timesheets should show/i).first()).toBeVisible();
  });

  test('T-005: Filter by POC', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByPlaceholder(/Francis in POC filter/i).fill('value');
    // Expected: Only timesheets with Francis as POC should show
    await expect(page.getByText(/Only timesheets with Francis as POC should show/i).first()).toBeVisible();
  });

  test('T-006: Filter by Year', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByPlaceholder(/2026 in the year filter/i).fill('value');
    // Expected: Only timesheets from 2026 should appear on the list
    await expect(page.getByText(/Only timesheets from 2026 should appear on the lis/i).first()).toBeVisible();
  });

  test('T-007: Filter by Month', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /November in the month filter/i }).click();
    // Expected: Only timesheets from november should show on the lsit
    await expect(page.getByText(/Only timesheets from november should show on the l/i).first()).toBeVisible();
  });

  test('T-008: Filter by Status', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    // Filter by status In review
    // Expected: Only timesheets in review should show on the list
    await expect(page.getByText(/Only timesheets in review should show on the list/i).first()).toBeVisible();
  });

  test('T-009: Filter by type', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /unified in the filter by type/i }).click();
    // Expected: Only unified timesheets should show on the list
    await expect(page.getByText(/Only unified timesheets should show on the list/i).first()).toBeVisible();
  });

  test('T-010: Generate timesheet', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('button', { name: /+Generate timesheet button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /current year and month/i }).click();
    await page.getByRole('button', { name: /generate reports/i }).click();
    // Expected: All timesheet should be generated for the selected time period
    await expect(page.getByText(/All timesheet should be generated for the selected/i).first()).toBeVisible();
  });

  test('T-011: Generate timesheet past month', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('button', { name: /+Generate timesheet button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /current year and past month/i }).click();
    await page.getByRole('button', { name: /generate reports/i }).click();
    // Expected: All timesheet should be generated for the selected time period
    await expect(page.getByText(/All timesheet should be generated for the selected/i).first()).toBeVisible();
  });

  test('T-012: Generate timesheet future month', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('button', { name: /+Generate timesheet button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /current year and next month/i }).click();
    await page.getByRole('button', { name: /generate reports/i }).click();
    // Expected: All timesheet should be generated for the selected time period
    await expect(page.getByText(/All timesheet should be generated for the selected/i).first()).toBeVisible();
  });

  test('T-013: Add medical leave', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a timesheet in the list/i }).click();
    await page.getByRole('button', { name: /the '+ Add activity' button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /leave type: Medical leave/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /leave period/i }).click();
    await page.getByRole('button', { name: /'update leave' button/i }).click();
    // Expected: Leave is added to the timesheet and leave details are updated
    await expect(page.getByText(/Leave is added to the timesheet and leave details /i).first()).toBeVisible();
  });

  test('T-014: Add family death', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a timesheet in the list/i }).click();
    await page.getByRole('button', { name: /the '+ Add activity' button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /leave type: Family Death/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /leave period/i }).click();
    await page.getByRole('button', { name: /'update leave' button/i }).click();
    // Expected: Leave is added to the timesheet and leave details are updated
    await expect(page.getByText(/Leave is added to the timesheet and leave details /i).first()).toBeVisible();
  });

  test('T-015: Add maternity leave', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a timesheet in the list/i }).click();
    await page.getByRole('button', { name: /the '+ Add activity' button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /leave type: Maternity leave/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /leave period/i }).click();
    await page.getByRole('button', { name: /'update leave' button/i }).click();
    // Expected: Leave is added to the timesheet and leave details are updated
    await expect(page.getByText(/Leave is added to the timesheet and leave details /i).first()).toBeVisible();
  });

  test('T-016: Add paternity leave', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a timesheet in the list/i }).click();
    await page.getByRole('button', { name: /the '+ Add activity' button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /leave type: Paternity leave/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /leave period/i }).click();
    await page.getByRole('button', { name: /'update leave' button/i }).click();
    // Expected: Leave is added to the timesheet and leave details are updated
    await expect(page.getByText(/Leave is added to the timesheet and leave details /i).first()).toBeVisible();
  });

  test('T-017: Add vacation', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a timesheet in the list/i }).click();
    await page.getByRole('button', { name: /the '+ Add activity' button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /leave type: Vacation/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /vacation period/i }).click();
    await page.getByRole('button', { name: /'update leave' button/i }).click();
    // Expected: Vacation is added to the timesheet and vacation details are updated
    await expect(page.getByText(/Vacation is added to the timesheet and vacation de/i).first()).toBeVisible();
  });

  test('T-018: Add overtime for Production Deployment', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a timesheet in the list/i }).click();
    await page.getByRole('button', { name: /the '+ Add activity' button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /Overtime/Timesheet tab/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a date/i }).click();
    // Pick 5PM to 8 PM as from and to time
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /Details Production Deployment option/i }).click();
    // Expected: Overtime is added with desctiption
    await expect(page.getByText(/Overtime is added with desctiption/i).first()).toBeVisible();
  });

  test('T-019: Add overtime for Bug fixing', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a timesheet in the list/i }).click();
    await page.getByRole('button', { name: /the '+ Add activity' button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /Overtime/Timesheet tab/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a date/i }).click();
    // Pick 12AM to  3AM as from and to time
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /Details Bug fixing option/i }).click();
    // Expected: Overtime is added with desctiption
    await expect(page.getByText(/Overtime is added with desctiption/i).first()).toBeVisible();
  });

  test('T-020: Add overtime for Client request', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a timesheet in the list/i }).click();
    await page.getByRole('button', { name: /the '+ Add activity' button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /Overtime/Timesheet tab/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a date/i }).click();
    // Pick 5PM to 8 PM as from and to time
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /Details Client request option/i }).click();
    // Expected: Overtime is added with desctiption
    await expect(page.getByText(/Overtime is added with desctiption/i).first()).toBeVisible();
  });

  test('T-021: Add overtime for Holiday-Customer support', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a timesheet in the list/i }).click();
    await page.getByRole('button', { name: /the '+ Add activity' button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /Overtime/Timesheet tab/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a date/i }).click();
    // Pick 5PM to 8 PM as from and to time
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /Details Holiday-Customer support option/i }).click();
    // Expected: Overtime is added with desctiption
    await expect(page.getByText(/Overtime is added with desctiption/i).first()).toBeVisible();
  });

  test('T-022: Add time off', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a timesheet in the list/i }).click();
    await page.getByRole('button', { name: /the '+ Add activity' button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /Overtime/Timesheet tab/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a date/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /Type Time Off/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /9AM to 5PM as from and to time/i }).click();
    await page.getByPlaceholder(/Details A B C/i).fill('value');
    await page.getByRole('button', { name: /update Record button/i }).click();
    // Expected: Time off is added with description
    await expect(page.getByText(/Time off is added with description/i).first()).toBeVisible();
  });

  test('T-023: Export single timesheet to excel', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a single timesheet on the list/i }).click();
    await page.getByRole('button', { name: /the 'Export to excel' button/i }).click();
    // Expected: Excel file is downloaded
    await expect(page.getByText(/Excel file is downloaded/i).first()).toBeVisible();
  });

  test('T-024: Export unified timesheet to excel', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an unified timesheet on the list/i }).click();
    await page.getByRole('button', { name: /the 'Export to excel' button/i }).click();
    // Expected: Excel file is downloaded
    await expect(page.getByText(/Excel file is downloaded/i).first()).toBeVisible();
  });

  test('T-025: Filter employees in timesheet by name', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a single timesheet on the list/i }).click();
    // Search for an employee using the name filter
    // Expected: Employee shows on the list
    await expect(page.getByText(/Employee shows on the list/i).first()).toBeVisible();
  });

  test('T-026: Filter employees in timesheet by min hours', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a single timesheet on the list/i }).click();
    // Search for an employee using the min hours filter
    // Expected: Employee shows on the list
    await expect(page.getByText(/Employee shows on the list/i).first()).toBeVisible();
  });

  test('T-027: Filter employees in timesheet by max hours', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a single timesheet on the list/i }).click();
    // Search for an employee using the max hours filter
    // Expected: Employee shows on the list
    await expect(page.getByText(/Employee shows on the list/i).first()).toBeVisible();
  });

  test('T-028: Change timesheet status', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('"1. Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a single timesheet on the list/i }).click();
    await page.getByRole('button', { name: /the 'Move to In review' button/i }).click();
    // Expected: Timesheet is in 'In review' status
    await expect(page.getByText(/Timesheet is in 'In review' status/i).first()).toBeVisible();
  });

  test('T-029: Add period comment', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('"1. Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a single timesheet on the list/i }).click();
    await page.getByRole('button', { name: /the Period comments tab/i }).click();
    await page.getByRole('button', { name: /the +New button/i }).click();
    await page.getByPlaceholder(/a comment/i).fill('value');
    await page.getByRole('button', { name: /Update/i }).click();
    // Expected: Comment is added to the timesheet
    await expect(page.getByText(/Comment is added to the timesheet/i).first()).toBeVisible();
  });

  test('T-030: Edit period comment', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('"1. Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a single timesheet on the list/i }).click();
    await page.getByRole('button', { name: /the Period comments tab/i }).click();
    await page.getByRole('button', { name: /the +New button/i }).click();
    await page.getByRole('button', { name: /the pencil icon to edit the comment/i }).click();
    // Make changes to the comment
    await page.getByRole('button', { name: /Update/i }).click();
    // Expected: Comment is modified in the timesheet
    await expect(page.getByText(/Comment is modified in the timesheet/i).first()).toBeVisible();
  });

  test('T-031: View leaves data', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a single timesheet on the list/i }).click();
    // Expand the leaves section
    // Expected: Leave data is displayed
    await expect(page.getByText(/Leave data is displayed/i).first()).toBeVisible();
  });

  test('T-032: Filter employees in unified timesheet by name', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an unified timesheet on the list/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Team/i }).click();
    // Search for an employee using the name filter
    // Expected: Employee shows on the list
    await expect(page.getByText(/Employee shows on the list/i).first()).toBeVisible();
  });

  test('T-033: Filter employees in unified timesheet by min hours', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an unified timesheet on the list/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Team/i }).click();
    // Search for an employee using the min hours filter
    // Expected: Employee shows on the list
    await expect(page.getByText(/Employee shows on the list/i).first()).toBeVisible();
  });

  test('T-034: Filter employees in unified timesheet by max hours', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an unified timesheet on the list/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Team/i }).click();
    // Search for an employee using the max hours filter
    // Expected: Employee shows on the list
    await expect(page.getByText(/Employee shows on the list/i).first()).toBeVisible();
  });

  test('T-035: Change unified timesheet status', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('"1. Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an unified timesheet on the list/i }).click();
    await page.getByRole('button', { name: /the 'Move to In review' button/i }).click();
    // Expected: Timesheet is in 'In review' status
    await expect(page.getByText(/Timesheet is in 'In review' status/i).first()).toBeVisible();
  });

  test('T-036: View unified timesheet leaves data', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an unified timesheet on the list/i }).click();
    // Expand the leaves section
    // Expected: Leave data is displayed
    await expect(page.getByText(/Leave data is displayed/i).first()).toBeVisible();
  });

  test('T-037: Add period comment unified timesheet', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('"1. Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an unified timesheet on the list/i }).click();
    await page.getByRole('button', { name: /the Period comments tab/i }).click();
    await page.getByRole('button', { name: /the +New button/i }).click();
    await page.getByPlaceholder(/a comment/i).fill('value');
    await page.getByRole('button', { name: /Update/i }).click();
    // Expected: Comment is added to the timesheet
    await expect(page.getByText(/Comment is added to the timesheet/i).first()).toBeVisible();
  });

  test('T-038: Edit period comment unified timesheet', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('"1. Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an unified timesheet on the list/i }).click();
    await page.getByRole('button', { name: /the Period comments tab/i }).click();
    await page.getByRole('button', { name: /the +New button/i }).click();
    await page.getByRole('button', { name: /the pencil icon to edit the comment/i }).click();
    // Make changes to the comment
    await page.getByRole('button', { name: /Update/i }).click();
    // Expected: Comment is modified in the timesheet
    await expect(page.getByText(/Comment is modified in the timesheet/i).first()).toBeVisible();
  });

  test('T-039: Reject a timesheet', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a single timesheet In review status on the list/i }).click();
    await page.getByRole('button', { name: /the reject period button/i }).click();
    // Expected: Timesheet is rejected
    await expect(page.getByText(/Timesheet is rejected/i).first()).toBeVisible();
  });

  test('T-040: Reject an unified timesheet', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an unified timesheet In review status on the list/i }).click();
    await page.getByRole('button', { name: /the reject period button/i }).click();
    // Expected: Timesheet is rejected
    await expect(page.getByText(/Timesheet is rejected/i).first()).toBeVisible();
  });

  test('T-041: View employee hours', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a single timesheet on the list/i }).click();
    await page.getByRole('button', { name: /an employee on the timesheet/i }).click();
    // Expected: Individiual hours show on a different pop-up window
    await expect(page.getByText(/Individiual hours show on a different pop-up windo/i).first()).toBeVisible();
  });

  test('T-042: View employee hours unified timesheet', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an unified timesheet on the list/i }).click();
    // Expand a team
    await page.getByRole('button', { name: /an employee on the timesheet/i }).click();
    // Expected: Individiual hours show on a different pop-up window
    await expect(page.getByText(/Individiual hours show on a different pop-up windo/i).first()).toBeVisible();
  });

  test('T-043: Items per page', async ({ page }) => {
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

  test('T-044: Pagination buttons', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('button', { name: /pagination button 2/i }).click();
    await page.getByRole('button', { name: /pagination button 1/i }).click();
    // Expected: Records to navigate through pages
    await expect(page.getByText(/Records to navigate through pages/i).first()).toBeVisible();
  });

  test('T-045: Pagination then search back', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('button', { name: /pagination button 2/i }).click();
    // Filter by name using a team in page 1
    await page.getByRole('button', { name: /pagination button 1/i }).click();
    // Expected: Timesheet with team shows on the table and page navigates to the first page
    await expect(page.getByText(/Timesheet with team shows on the table and page na/i).first()).toBeVisible();
  });

  test('T-001: Items are available', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await expect(page.getByText(/the following items are available:/i).first()).toBeVisible();
    // Timesheet periods title
    // Search by team filter
    // Search by poc filter
    // Search by year filter
    // Search by month filter
    // Search by status filter
    // Search by type filter
    // +Generate timesheet button
    // Timesheets table
    // Items per page dropdown
    // Pagination buttons
    // Expected: Items are available
    await expect(page.getByText(/Items are available/i).first()).toBeVisible();
  });

  test('T-002: Items are availabe single timesheet', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    // Open a single timesheet
    await expect(page.getByText(/the following items are available:/i).first()).toBeVisible();
    // Single timesheet detailed view
    // Timesheet tam name
    // Timesheet POC with mm/yy period
    // Refresh button
    // Regenerate timesheet button
    // ''+" New activity button
    // Move timesheet button
    // Expected hours count
    // Logged hours count
    // Employees count
    // Extra hours count
    // Time-off count
    // Overview tab
    // Employee name filter
    // Min hours filter
    // Max hours filter
    // Download button
    // Employee list
    // Overtime and timeoff tab
    // Overtime details by team and employees
    // Leave details by team and employees
    // Status change history tab
    // Timesheet status
    // Status progression bar
    // Period comments tab
    // New comment button
    // Comments list
    // Expected: Items are available
    await expect(page.getByText(/Items are available/i).first()).toBeVisible();
  });

  test('T-003: Items are availabe unified timesheet', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    // Open an unified timesheet
    await expect(page.getByText(/the following items are available:/i).first()).toBeVisible();
    // unified timesheet detailed view
    // Timesheet tam name
    // Unified timesheet icon
    // Timesheet POC with mm/yy period
    // Refresh button
    // Regenerate timesheet button
    // ''+" New activity button
    // Move timesheet button
    // Expected hours count
    // Logged hours count
    // Employees count
    // Extra hours count
    // Time-off count
    // Overview tab
    // Team selector
    // Employee name filter
    // Min hours filter
    // Max hours filter
    // Download button
    // Employee list
    // Overtime and timeoff tab
    // Team selector
    // Overtime details by team and employees
    // Leave details by team and employees
    // Status change history tab
    // Timesheet status
    // Status progression bar
    // Period comments tab
    // New comment button
    // Comments list
    // Expected: Items are available
    await expect(page.getByText(/Items are available/i).first()).toBeVisible();
  });

  test('T-004: Filter by team', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByPlaceholder(/STARB in search by team filter/i).fill('value');
    // Expected: Only STARB timesheets should show
    await expect(page.getByText(/Only STARB timesheets should show/i).first()).toBeVisible();
  });

  test('T-005: Filter by POC', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByPlaceholder(/Francis in POC filter/i).fill('value');
    // Expected: Only timesheets with Francis as POC should show
    await expect(page.getByText(/Only timesheets with Francis as POC should show/i).first()).toBeVisible();
  });

  test('T-006: Filter by Year', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByPlaceholder(/2026 in the year filter/i).fill('value');
    // Expected: Only timesheets from 2026 should appear on the list
    await expect(page.getByText(/Only timesheets from 2026 should appear on the lis/i).first()).toBeVisible();
  });

  test('T-007: Filter by Month', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /November in the month filter/i }).click();
    // Expected: Only timesheets from november should show on the lsit
    await expect(page.getByText(/Only timesheets from november should show on the l/i).first()).toBeVisible();
  });

  test('T-008: Filter by Status', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    // Filter by status In review
    // Expected: Only timesheets in review should show on the list
    await expect(page.getByText(/Only timesheets in review should show on the list/i).first()).toBeVisible();
  });

  test('T-009: Filter by type', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /unified in the filter by type/i }).click();
    // Expected: Only unified timesheets should show on the list
    await expect(page.getByText(/Only unified timesheets should show on the list/i).first()).toBeVisible();
  });

  test('T-010: Generate timesheet', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('button', { name: /+Generate timesheet button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /current year and month/i }).click();
    await page.getByRole('button', { name: /generate reports/i }).click();
    // Expected: All timesheet should be generated for the selected time period
    await expect(page.getByText(/All timesheet should be generated for the selected/i).first()).toBeVisible();
  });

  test('T-011: Generate timesheet past month', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('button', { name: /+Generate timesheet button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /current year and past month/i }).click();
    await page.getByRole('button', { name: /generate reports/i }).click();
    // Expected: All timesheet should be generated for the selected time period
    await expect(page.getByText(/All timesheet should be generated for the selected/i).first()).toBeVisible();
  });

  test('T-012: Generate timesheet future month', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('button', { name: /+Generate timesheet button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /current year and next month/i }).click();
    await page.getByRole('button', { name: /generate reports/i }).click();
    // Expected: All timesheet should be generated for the selected time period
    await expect(page.getByText(/All timesheet should be generated for the selected/i).first()).toBeVisible();
  });

  test('T-013: Add medical leave', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a timesheet in the list/i }).click();
    await page.getByRole('button', { name: /the '+ Add activity' button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /leave type: Medical leave/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /leave period/i }).click();
    await page.getByRole('button', { name: /'update leave' button/i }).click();
    // Expected: Leave is added to the timesheet and leave details are updated
    await expect(page.getByText(/Leave is added to the timesheet and leave details /i).first()).toBeVisible();
  });

  test('T-014: Add family death', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a timesheet in the list/i }).click();
    await page.getByRole('button', { name: /the '+ Add activity' button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /leave type: Family Death/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /leave period/i }).click();
    await page.getByRole('button', { name: /'update leave' button/i }).click();
    // Expected: Leave is added to the timesheet and leave details are updated
    await expect(page.getByText(/Leave is added to the timesheet and leave details /i).first()).toBeVisible();
  });

  test('T-015: Add maternity leave', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a timesheet in the list/i }).click();
    await page.getByRole('button', { name: /the '+ Add activity' button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /leave type: Maternity leave/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /leave period/i }).click();
    await page.getByRole('button', { name: /'update leave' button/i }).click();
    // Expected: Leave is added to the timesheet and leave details are updated
    await expect(page.getByText(/Leave is added to the timesheet and leave details /i).first()).toBeVisible();
  });

  test('T-016: Add paternity leave', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a timesheet in the list/i }).click();
    await page.getByRole('button', { name: /the '+ Add activity' button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /leave type: Paternity leave/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /leave period/i }).click();
    await page.getByRole('button', { name: /'update leave' button/i }).click();
    // Expected: Leave is added to the timesheet and leave details are updated
    await expect(page.getByText(/Leave is added to the timesheet and leave details /i).first()).toBeVisible();
  });

  test('T-017: Add vacation', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a timesheet in the list/i }).click();
    await page.getByRole('button', { name: /the '+ Add activity' button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /leave type: Vacation/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /vacation period/i }).click();
    await page.getByRole('button', { name: /'update leave' button/i }).click();
    // Expected: Vacation is added to the timesheet and vacation details are updated
    await expect(page.getByText(/Vacation is added to the timesheet and vacation de/i).first()).toBeVisible();
  });

  test('T-018: Add overtime for Production Deployment', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a timesheet in the list/i }).click();
    await page.getByRole('button', { name: /the '+ Add activity' button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /Overtime/Timesheet tab/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a date/i }).click();
    // Pick 5PM to 8 PM as from and to time
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /Details Production Deployment option/i }).click();
    // Expected: Overtime is added with desctiption
    await expect(page.getByText(/Overtime is added with desctiption/i).first()).toBeVisible();
  });

  test('T-019: Add overtime for Bug fixing', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a timesheet in the list/i }).click();
    await page.getByRole('button', { name: /the '+ Add activity' button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /Overtime/Timesheet tab/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a date/i }).click();
    // Pick 12AM to  3AM as from and to time
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /Details Bug fixing option/i }).click();
    // Expected: Overtime is added with desctiption
    await expect(page.getByText(/Overtime is added with desctiption/i).first()).toBeVisible();
  });

  test('T-020: Add overtime for Client request', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a timesheet in the list/i }).click();
    await page.getByRole('button', { name: /the '+ Add activity' button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /Overtime/Timesheet tab/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a date/i }).click();
    // Pick 5PM to 8 PM as from and to time
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /Details Client request option/i }).click();
    // Expected: Overtime is added with desctiption
    await expect(page.getByText(/Overtime is added with desctiption/i).first()).toBeVisible();
  });

  test('T-021: Add overtime for Holiday-Customer support', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a timesheet in the list/i }).click();
    await page.getByRole('button', { name: /the '+ Add activity' button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /Overtime/Timesheet tab/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a date/i }).click();
    // Pick 5PM to 8 PM as from and to time
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /Details Holiday-Customer support option/i }).click();
    // Expected: Overtime is added with desctiption
    await expect(page.getByText(/Overtime is added with desctiption/i).first()).toBeVisible();
  });

  test('T-022: Add time off', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a timesheet in the list/i }).click();
    await page.getByRole('button', { name: /the '+ Add activity' button/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an employee/i }).click();
    await page.getByRole('button', { name: /Overtime/Timesheet tab/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a date/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /Type Time Off/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /9AM to 5PM as from and to time/i }).click();
    await page.getByPlaceholder(/Details A B C/i).fill('value');
    await page.getByRole('button', { name: /update Record button/i }).click();
    // Expected: Time off is added with description
    await expect(page.getByText(/Time off is added with description/i).first()).toBeVisible();
  });

  test('T-023: Export single timesheet to excel', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a single timesheet on the list/i }).click();
    await page.getByRole('button', { name: /the 'Export to excel' button/i }).click();
    // Expected: Excel file is downloaded
    await expect(page.getByText(/Excel file is downloaded/i).first()).toBeVisible();
  });

  test('T-024: Export unified timesheet to excel', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an unified timesheet on the list/i }).click();
    await page.getByRole('button', { name: /the 'Export to excel' button/i }).click();
    // Expected: Excel file is downloaded
    await expect(page.getByText(/Excel file is downloaded/i).first()).toBeVisible();
  });

  test('T-025: Filter employees in timesheet by name', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a single timesheet on the list/i }).click();
    // Search for an employee using the name filter
    // Expected: Employee shows on the list
    await expect(page.getByText(/Employee shows on the list/i).first()).toBeVisible();
  });

  test('T-026: Filter employees in timesheet by min hours', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a single timesheet on the list/i }).click();
    // Search for an employee using the min hours filter
    // Expected: Employee shows on the list
    await expect(page.getByText(/Employee shows on the list/i).first()).toBeVisible();
  });

  test('T-027: Filter employees in timesheet by max hours', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a single timesheet on the list/i }).click();
    // Search for an employee using the max hours filter
    // Expected: Employee shows on the list
    await expect(page.getByText(/Employee shows on the list/i).first()).toBeVisible();
  });

  test('T-028: Change timesheet status', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('"1. Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a single timesheet on the list/i }).click();
    await page.getByRole('button', { name: /the 'Move to In review' button/i }).click();
    // Expected: Timesheet is in 'In review' status
    await expect(page.getByText(/Timesheet is in 'In review' status/i).first()).toBeVisible();
  });

  test('T-029: Add period comment', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('"1. Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a single timesheet on the list/i }).click();
    await page.getByRole('button', { name: /the Period comments tab/i }).click();
    await page.getByRole('button', { name: /the +New button/i }).click();
    await page.getByPlaceholder(/a comment/i).fill('value');
    await page.getByRole('button', { name: /Update/i }).click();
    // Expected: Comment is added to the timesheet
    await expect(page.getByText(/Comment is added to the timesheet/i).first()).toBeVisible();
  });

  test('T-030: Edit period comment', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('"1. Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a single timesheet on the list/i }).click();
    await page.getByRole('button', { name: /the Period comments tab/i }).click();
    await page.getByRole('button', { name: /the +New button/i }).click();
    await page.getByRole('button', { name: /the pencil icon to edit the comment/i }).click();
    // Make changes to the comment
    await page.getByRole('button', { name: /Update/i }).click();
    // Expected: Comment is modified in the timesheet
    await expect(page.getByText(/Comment is modified in the timesheet/i).first()).toBeVisible();
  });

  test('T-031: View leaves data', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a single timesheet on the list/i }).click();
    // Expand the leaves section
    // Expected: Leave data is displayed
    await expect(page.getByText(/Leave data is displayed/i).first()).toBeVisible();
  });

  test('T-032: Filter employees in unified timesheet by name', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an unified timesheet on the list/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Team/i }).click();
    // Search for an employee using the name filter
    // Expected: Employee shows on the list
    await expect(page.getByText(/Employee shows on the list/i).first()).toBeVisible();
  });

  test('T-033: Filter employees in unified timesheet by min hours', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an unified timesheet on the list/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Team/i }).click();
    // Search for an employee using the min hours filter
    // Expected: Employee shows on the list
    await expect(page.getByText(/Employee shows on the list/i).first()).toBeVisible();
  });

  test('T-034: Filter employees in unified timesheet by max hours', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an unified timesheet on the list/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Team/i }).click();
    // Search for an employee using the max hours filter
    // Expected: Employee shows on the list
    await expect(page.getByText(/Employee shows on the list/i).first()).toBeVisible();
  });

  test('T-035: Change unified timesheet status', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('"1. Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an unified timesheet on the list/i }).click();
    await page.getByRole('button', { name: /the 'Move to In review' button/i }).click();
    // Expected: Timesheet is in 'In review' status
    await expect(page.getByText(/Timesheet is in 'In review' status/i).first()).toBeVisible();
  });

  test('T-036: View unified timesheet leaves data', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an unified timesheet on the list/i }).click();
    // Expand the leaves section
    // Expected: Leave data is displayed
    await expect(page.getByText(/Leave data is displayed/i).first()).toBeVisible();
  });

  test('T-037: Add period comment unified timesheet', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('"1. Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an unified timesheet on the list/i }).click();
    await page.getByRole('button', { name: /the Period comments tab/i }).click();
    await page.getByRole('button', { name: /the +New button/i }).click();
    await page.getByPlaceholder(/a comment/i).fill('value');
    await page.getByRole('button', { name: /Update/i }).click();
    // Expected: Comment is added to the timesheet
    await expect(page.getByText(/Comment is added to the timesheet/i).first()).toBeVisible();
  });

  test('T-038: Edit period comment unified timesheet', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('"1. Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an unified timesheet on the list/i }).click();
    await page.getByRole('button', { name: /the Period comments tab/i }).click();
    await page.getByRole('button', { name: /the +New button/i }).click();
    await page.getByRole('button', { name: /the pencil icon to edit the comment/i }).click();
    // Make changes to the comment
    await page.getByRole('button', { name: /Update/i }).click();
    // Expected: Comment is modified in the timesheet
    await expect(page.getByText(/Comment is modified in the timesheet/i).first()).toBeVisible();
  });

  test('T-039: Reject a timesheet', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a single timesheet In review status on the list/i }).click();
    await page.getByRole('button', { name: /the reject period button/i }).click();
    // Expected: Timesheet is rejected
    await expect(page.getByText(/Timesheet is rejected/i).first()).toBeVisible();
  });

  test('T-040: Reject an unified timesheet', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an unified timesheet In review status on the list/i }).click();
    await page.getByRole('button', { name: /the reject period button/i }).click();
    // Expected: Timesheet is rejected
    await expect(page.getByText(/Timesheet is rejected/i).first()).toBeVisible();
  });

  test('T-041: View employee hours single timesheet', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a single timesheet on the list/i }).click();
    await page.getByRole('button', { name: /an employee on the timesheet/i }).click();
    // Expected: Individiual hours show on a different pop-up window
    await expect(page.getByText(/Individiual hours show on a different pop-up windo/i).first()).toBeVisible();
  });

  test('T-042: View employee hours unified timesheet', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /an unified timesheet on the list/i }).click();
    // Expand a team
    await page.getByRole('button', { name: /an employee on the timesheet/i }).click();
    // Expected: Individiual hours show on a different pop-up window
    await expect(page.getByText(/Individiual hours show on a different pop-up windo/i).first()).toBeVisible();
  });

  test('T-043: Items per page', async ({ page }) => {
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

  test('T-044: Pagination buttons', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('button', { name: /pagination button 2/i }).click();
    await page.getByRole('button', { name: /pagination button 1/i }).click();
    // Expected: Records to navigate through pages
    await expect(page.getByText(/Records to navigate through pages/i).first()).toBeVisible();
  });

  test('T-045: Pagination then search back', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Timesheets').click();
    await page.getByRole('button', { name: /pagination button 2/i }).click();
    // Filter by name using a team in page 1
    await page.getByRole('button', { name: /pagination button 1/i }).click();
    // Expected: Timesheet with team shows on the table and page navigates to the first page
    await expect(page.getByText(/Timesheet with team shows on the table and page na/i).first()).toBeVisible();
  });

  test('T-046: Validate Status flow, progress bar & Email send', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.user.file, AUTH_ROLES.user.username, AUTH_ROLES.user.password);
    await page.getByText('Timesheets').click();
    // Search for team STARB timesheet for the current month and year
    await expect(page.getByText(/the timesheet is in 'Open' status and co/i).first()).toBeVisible();
    // Move from 'Open' to 'OPS In Review' status
    await expect(page.getByText(/status progress bar is 'OPS In Review' a/i).first()).toBeVisible();
    // Move from'OPS In Review' to 'OPS Approved' status
    await expect(page.getByText(/status progress bar is 'OPS Approved'  a/i).first()).toBeVisible();
    // Move from 'Ops In Review' to 'Finance Approved' status
    await expect(page.getByText(/status progress bar is 'Finance Approved/i).first()).toBeVisible();
    await page.getByRole('button', { name: /the paper plane icon to send an email/i }).click();
    // Add destination email
    // Add a CC email
    // Add a BCC email
    await expect(page.getByText(/Subject is according to nomenclature, PO/i).first()).toBeVisible();
    await expect(page.getByText(/body is according to POC data and timesh/i).first()).toBeVisible();
    await page.getByRole('button', { name: /Send Email/i }).click();
    // Expected: Timesheet is in 'Sent to client' status and email is sent
    await expect(page.getByText(/Timesheet is in 'Sent to client' status and email /i).first()).toBeVisible();
  });

  test('T-047: Validate Status flow, progress bar & Email send', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.user.file, AUTH_ROLES.user.username, AUTH_ROLES.user.password);
    await page.getByText('Timesheets').click();
    // Search for team  AMTRUST timesheet for the current month and year
    await expect(page.getByText(/the timesheet is in 'Open' status and co/i).first()).toBeVisible();
    // Move from 'Open' to 'OPS In Review' status
    await expect(page.getByText(/status progress bar is 'OPS In Review' a/i).first()).toBeVisible();
    // Move from'OPS In Review' to 'OPS Approved' status
    await expect(page.getByText(/status progress bar is 'OPS Approved'  a/i).first()).toBeVisible();
    // Move from 'Ops In Review' to 'Finance Approved' status
    await expect(page.getByText(/status progress bar is 'Finance Approved/i).first()).toBeVisible();
    await page.getByRole('button', { name: /the paper plane icon to send an email/i }).click();
    // Add destination email
    // Add a CC email
    // Add a BCC email
    await expect(page.getByText(/Subject is according to nomenclature, PO/i).first()).toBeVisible();
    await expect(page.getByText(/body is according to POC data and timesh/i).first()).toBeVisible();
    await page.getByRole('button', { name: /Send Email/i }).click();
    // Expected: Timesheet is in Sent to client status
    await expect(page.getByText(/Timesheet is in Sent to client status/i).first()).toBeVisible();
  });

  test('T-048: Validate expected hours, buffer hours not included', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByText('Maintenance').click();
    // Assign one employee as buffer
    await page.getByText('Timesheets').click();
    // Search for team STARB timesheet for the current month and year
    await expect(page.getByText(/expected hours are the result of multipl/i).first()).toBeVisible();
    // Expected: Result aligns with expected hours value
    await expect(page.getByText(/Result aligns with expected hours value/i).first()).toBeVisible();
  });

  test('T-049: Validate expected hours, buffer hours not included', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByText('Timesheets').click();
    // Search for team  AMTRUST timesheet for the current month and year
    await expect(page.getByText(/expected hours are the result of multipl/i).first()).toBeVisible();
    // Expected: Result aligns with expected hours value
    await expect(page.getByText(/Result aligns with expected hours value/i).first()).toBeVisible();
  });

  test('T-050: Validate employee reasignation in timesheet', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByText('Maintenance').click();
    // Open Team STARB
    await page.getByRole('button', { name: /the reassign icon for  an employee in the team/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Team/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Position/i }).click();
    await page.getByRole('button', { name: /Next/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Supervisor/i }).click();
    await page.getByRole('button', { name: /Next/i }).click();
    // Leave dates as is
    await page.getByRole('button', { name: /Next/i }).click();
    await expect(page.getByText(/the following Items are visible:/i).first()).toBeVisible();
    // Employee
    // From Date
    // To Date
    // Supervisor
    // Transition Date
    await page.getByRole('button', { name: /Confirm Reassigment/i }).click();
    await page.getByText('STARB timesheet in the next month period after the reassignation date').click();
    // Expected: Reassigned employee should not come up in timesheet
    await expect(page.getByText(/Reassigned employee should not come up in timeshee/i).first()).toBeVisible();
  });

  test('T-051: Validate employee reasignation in timesheet', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByText('Maintenance').click();
    // Open Team AMTRUST
    await page.getByRole('button', { name: /the reassign icon for the first employee in the team/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Team/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Position/i }).click();
    await page.getByRole('button', { name: /Next/i }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /a Supervisor/i }).click();
    await page.getByRole('button', { name: /Next/i }).click();
    // Leave dates as is
    await page.getByRole('button', { name: /Next/i }).click();
    await expect(page.getByText(/the following Items are visible:/i).first()).toBeVisible();
    // Employee
    // From Date
    // To Date
    // Supervisor
    // Transition Date
    await page.getByRole('button', { name: /Confirm Reassigment/i }).click();
    await page.getByText('AMTRUST timesheet in the next month period after the reassignation date').click();
    // Expected: Reassigned employee should not come up in timesheet
    await expect(page.getByText(/Reassigned employee should not come up in timeshee/i).first()).toBeVisible();
  });

  test('T-052: One buffer cover multiple people', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByText('Teams').click();
    // Open Team STARB
    // Assign an employee as the only buffer in the team
    // Add leaves for 2 employees in the same day
    // Expected: Buffer can cover both employees but no more than 8 hours a day
    await expect(page.getByText(/Buffer can cover both employees but no more than 8/i).first()).toBeVisible();
  });

  test('T-053: Buffer covers leaves between months', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByText('Teams').click();
    // Open Team STARB
    // Assign an employee as the only buffer in the team
    // Add a leave for an employee in the team between the current and following month
    // Generate current and following months timesheets
    // Expected: Buffer should cover the hours in both timesheets respectively
    await expect(page.getByText(/Buffer should cover the hours in both timesheets r/i).first()).toBeVisible();
  });

  test('T-055: Buffer cannot cover before it joins the company', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByText('Teams').click();
    // Add a new employee to team STARB as buffer
    // Add a leave for another employee before the day the buffer joins the team
    // Expected: Buffer should not cover hours before it joins the company
    await expect(page.getByText(/Buffer should not cover hours before it joins the /i).first()).toBeVisible();
  });

  test('T-056: Buffer is no longer a buffer employee', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByText('Teams').click();
    // Add a new employee to team STARB as buffer
    // Add leaves for an employee on the same team
    // Check the buffer cover the hours in the timesheet
    await page.getByText('teams and select team STARB').click();
    // Uncheck the buffer checkbox for the buffer employee
    // Expected: Buffer is eliminated from the timesheet
    await expect(page.getByText(/Buffer is eliminated from the timesheet/i).first()).toBeVisible();
  });

  test('T-057: Buffer vacations', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByText('Teams').click();
    // Set an employee as the only buffer in team STARB
    // Add a leave for the buffer employee
    // Add a leave on the same date as the buffer employee for another employee
    // Expected: Buffer should not cover hours for other employee as he is also on leave
    await expect(page.getByText(/Buffer should not cover hours for other employee a/i).first()).toBeVisible();
  });
});
