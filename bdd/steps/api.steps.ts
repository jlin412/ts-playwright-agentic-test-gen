import { Given, Then, When, expect } from './fixtures';

Given('the API is ready', async ({ tagsApi }) => {
  await tagsApi.waitUntilReady();
});

When('I request tags', async ({ tagsApi, apiState }) => {
  apiState.tagsResponse = await tagsApi.getTags();
});

Then('tags array is returned', async ({ apiState }) => {
  expect(apiState.tagsResponse, 'tags response should be captured').toBeTruthy();
  expect(apiState.tagsResponse).toHaveProperty('tags');
  expect(Array.isArray(apiState.tagsResponse?.tags)).toBe(true);
});
