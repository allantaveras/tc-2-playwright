import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  constructor(public readonly page: Page) {}

  async goto(url?: string) {
    const baseUrl = process.env.BASE_URL || 'http://qa.evosphere.nt.core/';
    await this.page.goto(url || baseUrl, { waitUntil: 'networkidle' });
  }

  async waitForTimeout(ms: number) {
    await this.page.waitForTimeout(ms);
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  async clickElement(text: string) {
    await this.page.getByRole('button', { name: text }).click();
  }

  async clickLink(text: string) {
    await this.page.getByRole('link', { name: text }).click();
  }

  async fillField(label: string, value: string) {
    await this.page.getByLabel(label).fill(value);
  }

  async fillPlaceholder(placeholder: string, value: string) {
    await this.page.getByPlaceholder(placeholder).fill(value);
  }

  async selectOption(label: string, option: string) {
    await this.page.getByLabel(label).selectOption(option);
  }

  async checkElement(label: string) {
    await this.page.getByLabel(label).check();
  }

  async uncheckElement(label: string) {
    await this.page.getByLabel(label).uncheck();
  }

  async verifyVisible(text: string) {
    await expect(this.page.getByText(text, { exact: true }).first()).toBeVisible();
  }

  async verifyNotVisible(text: string) {
    await expect(this.page.getByText(text)).not.toBeVisible();
  }

  async navigateTo(path: string) {
    const baseUrl = process.env.BASE_URL || 'http://qa.evosphere.nt.core/';
    await this.page.goto(`${baseUrl.replace(/\/$/, '')}/${path}`, { waitUntil: 'networkidle' });
  }

  async getByText(text: string): Promise<Locator> {
    return this.page.getByText(text, { exact: true }).first();
  }

  async getByRole(role: 'button' | 'link' | 'textbox' | 'combobox' | 'dialog', name?: string): Promise<Locator> {
    if (name) return this.page.getByRole(role, { name });
    return this.page.getByRole(role);
  }
}
