import { BasePage } from './BasePage';

export class RecordHistoryPage extends BasePage {
  async navigate() {
    await this.goto();
  }

  async waitForLoad() {
    await this.waitForTimeout(1000);
  }
}
