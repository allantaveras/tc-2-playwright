import { BasePage } from './BasePage';

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
