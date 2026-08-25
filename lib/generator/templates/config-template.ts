export function getPlaywrightConfigTemplate(): string {
  return `import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://qa.evosphere.nt.core/',
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\\.setup\\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/admin.json',
      },
      dependencies: ['setup'],
    },
  ],
});
`;
}

export function getPackageJsonTemplate(): string {
  return `{
  "name": "ntsuite-automated-tests",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:ui": "playwright test --ui",
    "test:debug": "playwright test --debug",
    "report": "playwright show-report",
    "allure:generate": "allure generate allure-results --clean -o allure-report",
    "allure:open": "allure open allure-report",
    "allure:report": "npm run allure:generate && npm run allure:open"
  },
  "devDependencies": {
    "@playwright/test": "^1.55.1",
    "@types/node": "^24.3.1",
    "allure-playwright": "^3.0.0",
    "allure-commandline": "^2.29.0",
    "dotenv": "^16.4.0",
    "typescript": "^5.5.0"
  },
  "dependencies": {
    "@browserbasehq/stagehand": "^3.0.8"
  }
}
`;
}

export function getEnvTemplate(): string {
  return `# Target application URL
BASE_URL=http://qa.evosphere.nt.core/

# Stagehand API key (optional, for AI-powered selector extraction)
BROWSERBASE_API_KEY=
BROWSERBASE_PROJECT_ID=
`;
}

export function getAuthSetupTemplate(): string {
  return `import { test as setup, expect } from '@playwright/test';
import { login } from '../utils/Login';

const AUTH_FILES: { role: string; username: string; password: string; file: string }[] = [
  { role: 'admin', username: 'NT-5175', password: '2222', file: 'playwright/.auth/admin.json' },
  { role: 'user', username: 'NT-6041', password: '2222', file: 'playwright/.auth/user.json' },
  { role: 'supervisor', username: 'preinoso', password: '2222', file: 'playwright/.auth/supervisor.json' },
  { role: 'hr', username: 'NT-7941', password: '2222', file: 'playwright/.auth/hr.json' },
  { role: 'finance', username: 'NTG-5180', password: '2222', file: 'playwright/.auth/finance.json' },
];

for (const { role, username, password, file } of AUTH_FILES) {
  setup(\`Authenticate as \${role}\`, async ({ page }) => {
    await login(page, username, password);
    await expect(page.getByText('Welcome')).toBeVisible();
    await page.context().storageState({ path: file });
  });
}
`;
}

export function getLoginUtilTemplate(): string {
  return `import { expect } from '@playwright/test';
import { BASE_URL } from './config';

export async function login(page: any, username: string, password: string) {
  await page.goto(BASE_URL);
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).not.toHaveURL(/.*login/);
}
`;
}

export function getConfigUtilTemplate(): string {
  return `export const BASE_URL = process.env.BASE_URL ?? 'http://qa.evosphere.nt.core/';
export const API_BASE_URL = \`\${BASE_URL.replace(/\\/$/, '')}/api\`;
`;
}

export function getAuthHelperTemplate(): string {
  return `import { Page, expect } from '@playwright/test';
import { login } from './Login';
import { BASE_URL } from './config';
import * as fs from 'fs';
import * as path from 'path';

export const AUTH_ROLES: Record<string, { file: string; username: string; password: string }> = {
  admin: { file: 'playwright/.auth/admin.json', username: process.env.ADMIN_USER || 'NT-5175', password: process.env.ADMIN_PASS || '2222' },
  user: { file: 'playwright/.auth/user.json', username: process.env.USER_USER || 'NT-6041', password: process.env.USER_PASS || '2222' },
  supervisor: { file: 'playwright/.auth/supervisor.json', username: process.env.SUPERVISOR_USER || 'preinoso', password: process.env.SUPERVISOR_PASS || '2222' },
  hr: { file: 'playwright/.auth/hr.json', username: process.env.HR_USER || 'NT-7941', password: process.env.HR_PASS || '2222' },
  finance: { file: 'playwright/.auth/finance.json', username: process.env.FINANCE_USER || 'NTG-5180', password: process.env.FINANCE_PASS || '2222' },
  email_sender: { file: 'playwright/.auth/email_sender.json', username: process.env.EMAIL_USER || 'NTG-5220', password: process.env.EMAIL_PASS || '2222' },
};

export async function ensureAuthenticated(page: Page, storagePath: string, username: string, password: string) {
  const fullPath = path.resolve(process.cwd(), storagePath);
  const fileExists = fs.existsSync(fullPath);

  await page.goto(BASE_URL);
  await page.waitForTimeout(1000);

  if (page.url().includes('/login')) {
    console.log(\`[Auth] \${fileExists ? 'Session expired' : 'Initial auth'} for \${username}\`);
    await login(page, username, password);
    await expect(page.getByText('Welcome')).toBeVisible();
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    await page.context().storageState({ path: storagePath });
    console.log(\`[Auth] Session saved to \${storagePath}\`);
  } else {
    try {
      await expect(page.getByText('Welcome')).toBeVisible({ timeout: 5000 });
      console.log(\`[Auth] Using existing session for \${username}\`);
    } catch {
      console.log(\`[Auth] Session invalid for \${username}. Re-authenticating...\`);
      await page.goto(\`\${BASE_URL.replace(/\\/$/, '')}/login\`);
      await login(page, username, password);
      await expect(page.getByText('Welcome')).toBeVisible();
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      await page.context().storageState({ path: storagePath });
    }
  }
}
`;
}

export function getTsconfigTemplate(): string {
  return `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "outDir": "./dist",
    "rootDir": ".",
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
`;
}

export function getReadmeTemplate(targetUrl: string): string {
  return `# NTSuite Automated Tests

Generated test suite for NTSuite web application.

## Target

\`\`\`
${targetUrl}
\`\`\`

## Prerequisites

- Node.js 18+
- npm

## Setup

\`\`\`bash
npm install
npx playwright install
\`\`\`

## Authentication

The tests use Playwright's \`storageState\` for session management.  
Auth files are stored in \`playwright/.auth/*.json\` per role.

### First run — generate auth files:

\`\`\`bash
npx playwright test tests/auth.setup.ts
\`\`\`

This logs in once per role and saves the session state.

### Credentials

Default credentials are in \`utils/authHelper.ts\`.  
Override via environment variables in \`.env\`:

\`\`\`
ADMIN_USER=NT-5175
ADMIN_PASS=yourpassword
USER_USER=NT-6041
USER_PASS=yourpassword
\`\`\`

## Running Tests

### All tests:
\`\`\`bash
npx playwright test
\`\`\`

### Single module:
\`\`\`bash
npx playwright test --grep "Login Module"
npx playwright test --grep "Timesheets Module"
\`\`\`

### Single test case:
\`\`\`bash
npx playwright test --grep "L-001"
npx playwright test --grep "T-010"
\`\`\`

### Headed mode (see the browser):
\`\`\`bash
npx playwright test --headed
\`\`\`

### UI mode:
\`\`\`bash
npx playwright test --ui
\`\`\`

## Reports

### Playwright HTML report:
\`\`\`bash
npx playwright show-report
\`\`\`

### Allure report:
\`\`\`bash
npm run allure:generate
npm run allure:open
\`\`\`

## Project Structure

\`\`\`
├── playwright.config.ts       # Test configuration
├── .env                       # Environment variables
├── pages/                     # Page Object Models
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── HomePage.ts
│   ├── ClientsPage.ts
│   └── ...
├── tests/                     # Test specs
│   ├── auth.setup.ts          # Auth setup per role
│   ├── login.spec.ts
│   ├── home.spec.ts
│   ├── clients.spec.ts
│   ├── teams.spec.ts
│   ├── roster.spec.ts
│   └── ...
├── utils/                     # Shared utilities
│   ├── config.ts
│   ├── Login.ts
│   └── authHelper.ts
├── playwright/
│   └── .auth/                 # Session storage files
└── allure-results/            # Allure test results
\`\`\`

## Test Case Coverage

| Module | Test Cases |
|--------|-----------|
| Login | L-001 to L-011 |
| Home / Dashboard | H-001 to H-029 |
| Notifications | N-001 to N-013 |
| Clients | C-001 to C-013 |
| Point of Contact | P-001 to P-015 |
| Teams | T-001 to T-030 |
| Roster | R-001 to R-050 |
| Skills | S-001 to S-008 |
| Team Activities | M-001 to M-013 |
| Benched Employees | B-001 to B-012 |
| Timesheets | T-001 to T-057 |
| Holidays | HO-001 to HO-012 |
| Timesheet Builder | TB-001 to TB-006 |
| Evaluations | ME-001 to RH-007 |
`;
}
