import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  async clickSidebarItem(item: string) {
    await this.page.getByText(item).click();
  }

  async clickDashboardButton(buttonName: string) {
    await this.page.getByRole('button', { name: buttonName }).click();
  }

  async openNotifications() {
    await this.page.locator('[aria-haspopup="menu"]').first().click();
  }

  async clickAvatar() {
    await this.page.locator('div[aria-haspopup="menu"]').click();
  }

  async logout() {
    await this.clickAvatar();
    await this.clickElement('Sign Out');
  }

  async verifyAllItems(items: string[]) {
    for (const item of items) {
      const trimmed = item.trim();
      if (trimmed) {
        await this.verifyVisible(trimmed);
      }
    }
  }
}
