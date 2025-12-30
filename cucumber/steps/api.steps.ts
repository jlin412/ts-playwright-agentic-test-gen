import { expect } from '@playwright/test';
import { Given, Then, When } from '@cucumber/cucumber';

import { RealWorldWorld } from '../support/world.ts';

Given('the API is ready', async function (this: RealWorldWorld) {
  expect(this.tagsApi).toBeTruthy();
  await this.tagsApi!.waitUntilReady();
});

When('I request tags', async function (this: RealWorldWorld) {
  expect(this.tagsApi).toBeTruthy();
  this.tagsResponse = await this.tagsApi!.getTags();
});

Then('I should receive a tags array', function (this: RealWorldWorld) {
  const body = this.tagsResponse as any;
  expect(body).toHaveProperty('tags');
  expect(Array.isArray(body.tags)).toBe(true);
});
