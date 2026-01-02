import { Given, Then } from './fixtures';

Given('I am on the home page', async function () {
  await this.homePage.goto();
});

Then('the home page is loaded', async function () {
  await this.homePage.expectLoaded();
});
