import { test } from '@playwright/test';
import fs from 'fs';

test('capture screenshots', async ({ page }) => {
  test.setTimeout(120000);
  if (!fs.existsSync('public/docs')) {
    fs.mkdirSync('public/docs', { recursive: true });
  }

  // Dashboard
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'public/docs/dashboard.png', fullPage: true });

  // Upload
  await page.goto('http://localhost:3000/upload');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'public/docs/upload.png', fullPage: true });

  // Explore
  await page.goto('http://localhost:3000/explore');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'public/docs/explore.png', fullPage: true });

  // Generate
  await page.goto('http://localhost:3000/generate');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'public/docs/generate.png', fullPage: true });
});
