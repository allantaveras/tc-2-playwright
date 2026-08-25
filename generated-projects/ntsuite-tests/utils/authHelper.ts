import { Page, expect } from '@playwright/test';
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
    console.log(`[Auth] ${fileExists ? 'Session expired' : 'Initial auth'} for ${username}`);
    await login(page, username, password);
    await expect(page.getByText('Welcome')).toBeVisible();
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    await page.context().storageState({ path: storagePath });
    console.log(`[Auth] Session saved to ${storagePath}`);
  } else {
    try {
      await expect(page.getByText('Welcome')).toBeVisible({ timeout: 5000 });
      console.log(`[Auth] Using existing session for ${username}`);
    } catch {
      console.log(`[Auth] Session invalid for ${username}. Re-authenticating...`);
      await page.goto(`${BASE_URL.replace(/\/$/, '')}/login`);
      await login(page, username, password);
      await expect(page.getByText('Welcome')).toBeVisible();
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      await page.context().storageState({ path: storagePath });
    }
  }
}
