import { Given, Then } from './fixtures';

Given('I am on the home page', async ({ homePage }) => {
  await homePage.goto();
});

Then('the home page is loaded', async ({ homePage }) => {
  await homePage.expectLoaded();
});
