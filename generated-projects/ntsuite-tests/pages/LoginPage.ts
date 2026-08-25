import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  async login(username: string, password: string) {
    await this.fillPlaceholder('Username', username);
    await this.fillPlaceholder('Password', password);
    await this.clickElement('Sign In');
    await this.waitForTimeout(2000);
  }

  async isLoginErrorVisible(): Promise<boolean> {
    try {
      await this.verifyVisible('Invalid username or password');
      return true;
    } catch {
      return false;
    }
  }

  async getErrorMessage(): Promise<string> {
    try {
      const el = await this.getByText('Error');
      return await el.textContent() || '';
    } catch {
      return '';
    }
  }
}
