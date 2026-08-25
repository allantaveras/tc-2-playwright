import { BasePage } from './BasePage';

export class PendingEvaluationsPage extends BasePage {
  async navigate() {
    await this.goto();
  }

  async waitForLoad() {
    await this.waitForTimeout(1000);
  }
}
