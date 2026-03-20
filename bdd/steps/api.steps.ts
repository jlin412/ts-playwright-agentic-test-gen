import { Given, Then, When, expect } from './fixtures';

Given('the API is ready', async function () {
  await this.tagsApi.waitUntilReady();
});

When('I request tags', async function () {
  this.apiState.tagsResponse = await this.tagsApi.getTags();
});

Then('tags array is returned', async function () {
  expect(this.apiState.tagsResponse, 'tags response should be captured').toBeTruthy();
  expect(this.apiState.tagsResponse).toHaveProperty('tags');
  expect(Array.isArray(this.apiState.tagsResponse?.tags)).toBe(true);
});
