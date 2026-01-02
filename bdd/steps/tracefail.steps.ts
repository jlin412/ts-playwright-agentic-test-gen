import { Then, expect } from './fixtures';

Then('I should see a non-existent heading', async ({ homePage }) => {
  await expect(
    homePage.page.getByRole('heading', { name: 'definitely-not-a-real-heading' }),
  ).toBeVisible({ timeout: 1000 });
});
