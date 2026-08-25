import { test, expect } from '@playwright/test';
import { ensureAuthenticated, AUTH_ROLES } from '../utils/authHelper';
import { HomePage } from '../pages/HomePage';

const SIDEBAR_ITEMS_ADMIN = [
  'Maintenance', 'My Team', 'My Team Activities',
  'Timesheets', 'Evaluations', 'Team Evaluations',
  'Reports', 'Tickets', 'Activities', 'Holidays'
];

test.describe('Home / Dashboard Module', () => {
  test('H-001: Items are available - Admin', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    const homePage = new HomePage(page);
    for (const item of SIDEBAR_ITEMS_ADMIN) {
      await expect(page.getByText(item).first()).toBeVisible();
    }
  });

  test('H-011: Logout - Admin', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    const homePage = new HomePage(page);
    await homePage.logout();
    await expect(page).toHaveURL(/.*login/);
  });

  test('H-015: Logout - User', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.user.file, AUTH_ROLES.user.username, AUTH_ROLES.user.password);
    const homePage = new HomePage(page);
    await homePage.logout();
    await expect(page).toHaveURL(/.*login/);
  });

  test('H-025: Recommended Task - Admin', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    const homePage = new HomePage(page);
    await homePage.clickDashboardButton('Recommended Task');
    await expect(page).toHaveURL(/.*evaluations/);
  });

  test('H-029: Recommended Task - User', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.user.file, AUTH_ROLES.user.username, AUTH_ROLES.user.password);
    const homePage = new HomePage(page);
    await homePage.clickDashboardButton('Recommended Task');
    await expect(page).toHaveURL(/.*evaluations/);
  });
});
