import { test, expect } from '@playwright/test';
import { ensureAuthenticated, AUTH_ROLES } from '../utils/authHelper';

test.describe('My Evaluations Module', () => {
  test.beforeEach(async ({ page }) => {
    // Navigation is handled per-test based on preconditions
  });

  test('ME-001: Items are available', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Evaluations').click();
    await expect(page.getByText(/the following items are available:/i).first()).toBeVisible();
    // My Evaluations title
    // Clasification Legend:
    // 0 a 59 Deficient (D)
    // 60 a 69 Improvement (C)
    // 70 a 79 Good (B)
    // 80 a 89 Very Good (A)
    // 90 a 100 Excellent (A+)
    // Supervisor filter
    // Year filter
    // Signature Status filter
    // Evaluations table with columns: Year, Quarter, Signature, Supervisor Name, Average, Calification
    // Items per page dropdown
    // Pagination buttons
    // Expected: Items are available
    await expect(page.getByText(/Items are available/i).first()).toBeVisible();
  });

  test('ME-002: Filter by supervisor', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Evaluations').click();
    await page.getByPlaceholder(/a supervisor name in the supervisor name filter/i).fill('value');
    // Expected: Evaluations with that supervisor show in the evaluations list
    await expect(page.getByText(/Evaluations with that supervisor show in the evalu/i).first()).toBeVisible();
  });

  test('ME-003: Filter by year', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Evaluations').click();
    await page.getByPlaceholder(/a year in the Year filter/i).fill('value');
    // Expected: Evaluations from that year show in the evaluations list
    await expect(page.getByText(/Evaluations from that year show in the evaluations/i).first()).toBeVisible();
  });

  test('ME-004: Filter by Signature status', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Evaluations').click();
    await page.getByPlaceholder(/a status in the Signature Status filter/i).fill('value');
    // Expected: Evaluations with that status show in the evaluations list
    await expect(page.getByText(/Evaluations with that status show in the evaluatio/i).first()).toBeVisible();
  });

  test('ME-005: Open evaluation', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Evaluations').click();
    await page.getByRole('button', { name: /an evaluation/i }).click();
    await expect(page.getByText(/the following items are available:/i).first()).toBeVisible();
    // Evaluation name
    // Signature Status
    // Evaluation Date
    // Average Evaluation
    // Evaluation Period
    // Evaluation Supervisor
    // Evaluation sections:
    // Asistencia & puntualidad
    // Confiabilidad
    // Conocimiento del trabajo
    // Iniciativa & creatividad
    // Productividad
    // Trabajo en equipo
    // Supervisor comments
    // Employee comments
    // Expected: Evaluation data shows in the new window
    await expect(page.getByText(/Evaluation data shows in the new window/i).first()).toBeVisible();
  });

  test('ME-006: Edit evaluation', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.supervisor.file, AUTH_ROLES.supervisor.username, AUTH_ROLES.supervisor.password);
    await page.getByText('Evaluations').click();
    await page.getByRole('button', { name: /a pending evaluation/i }).click();
    await page.getByRole('button', { name: /the edit button/i }).click();
    // Add comment
    // Add signature
    await page.getByRole('button', { name: /'Save' button/i }).click();
    // Expected: Comments and signature are saved
    await expect(page.getByText(/Comments and signature are saved/i).first()).toBeVisible();
  });

  test('ME-007: Items per page', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.finance.file, AUTH_ROLES.finance.username, AUTH_ROLES.finance.password);
    await page.getByText('Evaluations').click();
    await expect(page.getByText(/table shows 10 items/i).first()).toBeVisible();
    // Change Items per page to '20'
    await expect(page.getByText(/table shows 20 items/i).first()).toBeVisible();
    // Change Items per page to '50'
    await expect(page.getByText(/table shows 50 items/i).first()).toBeVisible();
    // Expected: Table to adjust ammount of records apropiately
    await expect(page.getByText(/Table to adjust ammount of records apropiately/i).first()).toBeVisible();
  });
});
