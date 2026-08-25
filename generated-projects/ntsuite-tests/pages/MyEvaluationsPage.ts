import { BasePage } from './BasePage';

export class MyEvaluationsPage extends BasePage {
  async navigate() {
    await this.goto();
  }

  async waitForLoad() {
    await this.waitForTimeout(1000);
  }
}
