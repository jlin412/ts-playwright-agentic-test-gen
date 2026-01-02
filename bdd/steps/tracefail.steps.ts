import { Then, expect } from './fixtures';

Then('I should see a non-existent heading', async function () {
  await expect(
    this.homePage.page.getByRole('heading', { name: 'definitely-not-a-real-heading' }),
  ).toBeVisible({ timeout: 1000 });
});
