import { BasePage } from './BasePage';

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
