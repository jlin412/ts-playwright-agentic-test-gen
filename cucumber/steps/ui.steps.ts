import { expect } from '@playwright/test';
import { Given, Then } from '@cucumber/cucumber';

import { RealWorldWorld } from '../support/world.ts';

Given('I open the home page', async function (this: RealWorldWorld) {
  expect(this.homePage).toBeTruthy();
  await this.homePage!.goto(this.urls.uiURL);
});

Then('I should see the conduit home page', async function (this: RealWorldWorld) {
  expect(this.homePage).toBeTruthy();
  await this.homePage!.expectLoaded();
});
