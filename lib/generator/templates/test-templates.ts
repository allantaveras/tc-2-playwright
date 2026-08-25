export function getLoginTestsTemplate(): string {
  return `import { test, expect } from '@playwright/test';
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
`;
}

export function getHomeTestsTemplate(): string {
  return `import { test, expect } from '@playwright/test';
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
`;
}

export function getGenericTestsTemplate(moduleName: string, tcs: { id: string; scenario: string; test_case: string; preconditions: string; steps: string; expected: string }[]): string {
  const tests = tcs.map(tc => {
    const lines = tc.steps.split("\n").filter(l => l.trim());
    const stepsCode = lines.map(l => {
      const step = l.replace(/^\d+[\.\)]\s*/, "").trim();
      const lower = step.toLowerCase();

      if (lower.includes("go to")) {
        const path = step.replace(/go to/i, "").trim();
        return `    await page.getByText('${path.split(">")[0].trim()}').click();`;
      }
      if (lower.startsWith("click")) {
        const target = step.replace(/^click\s+(on\s+)?/i, "").replace(/[""]/g, "").trim();
        return `    await page.getByRole('button', { name: /${target}/i }).click();`;
      }
      if (lower.startsWith("enter") || lower.startsWith("type") || lower.startsWith("fill")) {
        const match = step.match(/(?:enter|type|fill)\s+(.+?)(?:\s*[""](.+?)[""])?\s*$/i);
        if (match) {
          const target = match[1].replace(/[""]/g, "").trim();
          const value = match[2] ? match[2].replace(/[""]/g, "") : "value";
          return `    await page.getByPlaceholder(/${target}/i).fill('${value}');`;
        }
        return `    // ${step}`;
      }
      if (lower.startsWith("validate") || lower.includes("should")) {
        const target = step.replace(/validate/i, "").replace(/^the following items are available:?\s*/i, "").trim();
        if (target) {
          return `    await expect(page.getByText(/${target.substring(0, 40)}/i).first()).toBeVisible();`;
        }
        return `    // Validate: ${step}`;
      }
      if (lower.startsWith("select")) {
        const option = step.replace(/select/i, "").trim();
        return `    await page.getByRole('combobox').click();\n    await page.getByRole('option', { name: /${option}/i }).click();`;
      }

      return `    // ${step}`;
    }).filter(l => l.trim()).join("\n");

    return `
  test('${tc.id}: ${tc.scenario}', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.${getRoleFromPreconditions(tc.preconditions)}.file, AUTH_ROLES.${getRoleFromPreconditions(tc.preconditions)}.username, AUTH_ROLES.${getRoleFromPreconditions(tc.preconditions)}.password);
${stepsCode}
    // Expected: ${tc.expected}
    await expect(page.getByText(/${tc.expected.substring(0, 50)}/i).first()).toBeVisible();
  });`;
  }).join("\n");

  return `import { test, expect } from '@playwright/test';
import { ensureAuthenticated, AUTH_ROLES } from '../utils/authHelper';

test.describe('${moduleName} Module', () => {
  test.beforeEach(async ({ page }) => {
    // Navigation is handled per-test based on preconditions
  });
${tests}
});
`;
}

function getRoleFromPreconditions(preconditions: string): string {
  const lower = preconditions.toLowerCase();
  if (lower.includes("finance")) return "finance";
  if (lower.includes("supervisor")) return "supervisor";
  if (lower.includes("hr")) return "hr";
  if (lower.includes("user")) return "user";
  return "admin";
}

export function getTimesheetsTestsTemplate(): string {
  return `import { test, expect } from '@playwright/test';
import { ensureAuthenticated, AUTH_ROLES } from '../utils/authHelper';

test.describe('Timesheets Module', () => {
  test('T-001: Items are available', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByText('Timesheets').click();
    await page.getByText('List of Timesheets').click();
    await expect(page.getByText('Timesheet periods')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Search by team' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Search by poc' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Generate' })).toBeVisible();
  });

  test('T-010: Generate timesheet', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByText('Timesheets').click();
    await page.getByText('List of Timesheets').click();
    await page.getByRole('button', { name: /Generate/i }).click();
    await page.getByRole('dialog').getByRole('textbox', { name: 'Year' }).fill('2026');
    await page.getByRole('dialog').getByRole('textbox', { name: /month/i }).first().fill('January');
    await page.getByRole('dialog').getByRole('button', { name: /generate/i }).click();
  });

  test('T-004: Filter by team', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByText('Timesheets').click();
    await page.getByText('List of Timesheets').click();
    await page.getByRole('textbox', { name: 'Search by team' }).fill('STARB');
  });
});
`;
}

export function getEvaluationsTestsTemplate(): string {
  return `import { test, expect } from '@playwright/test';
import { ensureAuthenticated, AUTH_ROLES } from '../utils/authHelper';

test.describe('Evaluations Module', () => {
  test('ME-001: Items are available - My Evaluations', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByText('Evaluations').click();
    await page.getByText('My Evaluations').click();
    await expect(page.getByText('My Evaluations')).toBeVisible();
    await expect(page.getByText('Supervisor').first()).toBeVisible();
    await expect(page.getByText('Year')).toBeVisible();
  });

  test('LE-001: Items are available - List of Evaluations', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByText('Evaluations').click();
    await page.getByText('List of Evaluations').click();
    await expect(page.getByText('Evaluations Management')).toBeVisible();
  });

  test('PE-001: Items are available - Pending Evaluations', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByText('Evaluations').click();
    await page.getByText('Pending Evaluations').click();
    await expect(page.getByText('Pending Evaluations')).toBeVisible();
  });

  test('RH-001: Items are available - Record History', async ({ page }) => {
    await ensureAuthenticated(page, AUTH_ROLES.admin.file, AUTH_ROLES.admin.username, AUTH_ROLES.admin.password);
    await page.getByText('Evaluations').click();
    await page.getByText('Record History').click();
    await expect(page.getByText('Record History')).toBeVisible();
  });
});
`;
}
