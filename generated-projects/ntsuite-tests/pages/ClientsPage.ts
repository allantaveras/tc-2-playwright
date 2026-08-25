import { BasePage } from './BasePage';

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
