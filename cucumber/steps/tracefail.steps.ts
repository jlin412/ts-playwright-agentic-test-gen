import { expect } from '@playwright/test';
import { Then } from '@cucumber/cucumber';

import { RealWorldWorld } from '../support/world.ts';

Then('I should see a heading that does not exist', async function (this: RealWorldWorld) {
  expect(this.page).toBeTruthy();

  // Fail fast so the scenario ends quickly, but still produces a trace.
  await expect(
    this.page!.getByRole('heading', { name: 'definitely-not-a-real-heading' }),
  ).toBeVisible({ timeout: 1000 });
});
