import { expect } from '@playwright/test';
import { BASE_URL } from './config';

export async function login(page: any, username: string, password: string) {
  await page.goto(BASE_URL);
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).not.toHaveURL(/.*login/);
}
