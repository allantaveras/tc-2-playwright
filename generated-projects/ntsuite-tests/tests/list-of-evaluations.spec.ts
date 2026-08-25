import { test, expect } from '@playwright/test';
import { ensureAuthenticated, AUTH_ROLES } from '../utils/authHelper';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login Module', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('L-001: Positive login - Admin', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('NT-5175', '1');
    await expect(page).not.toHaveURL(/.*login/);
  });

  test('L-002: Positive login - User', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('NT-6041', '1');
    await expect(page).not.toHaveURL(/.*login/);
  });

  test('L-003: Positive login - Supervisor', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('preinoso', '1');
    await expect(page).not.toHaveURL(/.*login/);
  });

  test('L-004: Positive login - HR', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('NT-7941', '1');
    await expect(page).not.toHaveURL(/.*login/);
  });

  test('L-005: Positive login - Finance', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('NTG-5180', '1');
    await expect(page).not.toHaveURL(/.*login/);
  });

  test('L-006: Negative login - Wrong user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('NT-0000', '1');
    await expect(page.getByText('Invalid username or password')).toBeVisible();
  });

  test('L-007: Negative login - Empty fields', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Please fill out this field').first()).toBeVisible();
  });

  test('L-008: Negative login - User only', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.getByPlaceholder('Username').fill('NT-5175');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Please fill out this field').first()).toBeVisible();
  });

  test('L-009: Negative login - Password only', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.getByPlaceholder('Password').fill('1');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Please fill out this field').first()).toBeVisible();
  });

  test('L-010: Negative login - Lowercase user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('nt-5175', '1');
    await expect(page.getByText('Invalid username or password')).toBeVisible();
  });

  test('L-011: Show Password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.getByPlaceholder('Username').fill('NT-5175');
    await page.getByPlaceholder('Password').fill('1');
    await page.locator('[data-testid="show-password"]').click();
    await expect(page.getByPlaceholder('Password')).toHaveAttribute('type', 'text');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).not.toHaveURL(/.*login/);
  });
});
