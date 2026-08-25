import { test as setup, expect } from '@playwright/test';
import { login } from '../utils/Login';

const AUTH_FILES: { role: string; username: string; password: string; file: string }[] = [
  { role: 'admin', username: 'NT-5175', password: '2222', file: 'playwright/.auth/admin.json' },
  { role: 'user', username: 'NT-6041', password: '2222', file: 'playwright/.auth/user.json' },
  { role: 'supervisor', username: 'preinoso', password: '2222', file: 'playwright/.auth/supervisor.json' },
  { role: 'hr', username: 'NT-7941', password: '2222', file: 'playwright/.auth/hr.json' },
  { role: 'finance', username: 'NTG-5180', password: '2222', file: 'playwright/.auth/finance.json' },
];

for (const { role, username, password, file } of AUTH_FILES) {
  setup(`Authenticate as ${role}`, async ({ page }) => {
    await login(page, username, password);
    await expect(page.getByText('Welcome')).toBeVisible();
    await page.context().storageState({ path: file });
  });
}
