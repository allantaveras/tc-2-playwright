export function getBasePageTemplate(): string {
  return `import { Page, Locator, expect } from '@playwright/test';

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
    await this.page.screenshot({ path: \`screenshots/\${name}.png\`, fullPage: true });
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
    await this.page.goto(\`\${baseUrl.replace(/\\/$/, '')}/\${path}\`, { waitUntil: 'networkidle' });
  }

  async getByText(text: string): Promise<Locator> {
    return this.page.getByText(text, { exact: true }).first();
  }

  async getByRole(role: 'button' | 'link' | 'textbox' | 'combobox' | 'dialog', name?: string): Promise<Locator> {
    if (name) return this.page.getByRole(role, { name });
    return this.page.getByRole(role);
  }
}
`;
}

export function getLoginPageTemplate(): string {
  return `import { BasePage } from './BasePage';

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
`;
}

export function getHomePageTemplate(): string {
  return `import { BasePage } from './BasePage';

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
`;
}

export function getClientsPageTemplate(): string {
  return `import { BasePage } from './BasePage';

export class ClientsPage extends BasePage {
  async navigate() {
    await this.goto();
    await this.clickElement('Maintenance');
    await this.clickElement('Clients');
  }

  async clickAddClient() {
    await this.clickElement('+Add a new client');
  }

  async fillClientName(name: string) {
    await this.fillField('Name', name);
  }

  async pickColor(color: string) {
    await this.fillField('Color', color);
  }

  async setClientStatus(active: boolean) {
    if (active) await this.checkElement('Status');
    else await this.uncheckElement('Status');
  }

  async saveClient() {
    await this.clickElement('Save');
  }

  async searchByName(name: string) {
    await this.fillPlaceholder('Search by name', name);
  }

  async filterByStatus(status: string) {
    await this.page.getByRole('combobox', { name: 'Status' }).click();
    await this.page.getByRole('option', { name: status }).click();
  }

  async editClient(name: string) {
    await this.page.getByRole('row').filter({ hasText: name }).getByRole('button').first().click();
  }
}
`;
}

export function getTeamsPageTemplate(): string {
  return `import { BasePage } from './BasePage';

export class TeamsPage extends BasePage {
  async navigate() {
    await this.goto();
    await this.clickElement('Maintenance');
    await this.clickElement('Teams');
  }

  async clickAddTeam() {
    await this.clickElement('+Add a new Team');
  }

  async fillTeamName(name: string) {
    await this.fillField('Team Name', name);
  }

  async selectClient(client: string) {
    await this.selectOption('Client', client);
  }

  async selectOwner(owner: string) {
    await this.selectOption('Owner', owner);
  }

  async selectTeamPoc(poc: string) {
    await this.selectOption('Team POC', poc);
  }

  async fillMaxOccupation(max: string) {
    await this.fillField('Max Occupation', max);
  }

  async setTeamStatus(active: boolean) {
    if (active) await this.checkElement('Status');
    else await this.uncheckElement('Status');
  }

  async setIncludeInTimesheet(include: boolean) {
    if (include) await this.checkElement('Include in Timesheet');
    else await this.uncheckElement('Include in Timesheet');
  }

  async saveTeam() {
    await this.clickElement('Save');
  }

  async openTeam(teamName: string) {
    await this.page.getByRole('cell', { name: teamName }).click();
  }

  async clickEditTeam() {
    await this.clickElement('Edit Team');
  }

  async updateTeam() {
    await this.clickElement('Update Team');
  }

  async clickPencilIcon() {
    await this.page.locator('svg.tabler-icon-pencil').first().click();
  }

  async filterByTeamName(name: string) {
    await this.fillPlaceholder('Search by name', name);
  }

  async filterByStatus(status: string) {
    await this.page.getByRole('combobox', { name: 'Status' }).click();
    await this.page.getByRole('option', { name: status }).click();
  }

  async searchEmployee(searchTerm: string) {
    await this.fillPlaceholder('Search employee', searchTerm);
  }
}
`;
}

export function getRosterPageTemplate(): string {
  return `import { BasePage } from './BasePage';

export class RosterPage extends BasePage {
  async navigate() {
    await this.goto();
    await this.clickElement('Maintenance');
    await this.clickElement('Roster');
  }

  async searchGeneral(query: string) {
    await this.fillPlaceholder('Search by name', query);
  }

  async filterByStatus(status: string) {
    await this.page.getByRole('combobox', { name: 'Status' }).click();
    await this.page.getByRole('option', { name: status }).click();
  }

  async filterBySupervisor(name: string) {
    await this.page.getByRole('combobox', { name: 'Supervisor' }).click();
    await this.page.getByRole('option', { name }).click();
  }

  async filterByTeam(team: string) {
    await this.page.getByRole('combobox', { name: 'Team' }).click();
    await this.page.getByRole('option', { name: team }).click();
  }

  async selectEmployee(name: string) {
    await this.page.getByRole('cell', { name }).click();
  }

  async clickBenchTab() {
    await this.page.getByRole('tab', { name: 'Bench' }).click();
  }

  async clickEditEmployee() {
    await this.page.locator('svg.tabler-icon-pencil').first().click();
  }

  async updateEmployee() {
    await this.clickElement('Update');
  }

  async clickAddSkill() {
    await this.clickElement('Add Skill');
  }

  async clickSaveSkills() {
    await this.clickElement('Save All Skills');
  }

  async clickInterviewsTab() {
    await this.clickElement('Interviews');
  }

  async clickHistoryTab() {
    await this.clickElement('History');
  }

  async addInterview() {
    await this.clickElement('Add Interview');
  }

  async filterInterviewByDate(date: string) {
    await this.fillField('Date', date);
  }
}
`;
}
