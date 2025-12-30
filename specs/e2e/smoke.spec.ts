import { test } from '../fixtures';

test.describe('UI smoke', () => {
  test('home page loads', async ({ homePage }) => {
    await homePage.goto();
    await homePage.expectLoaded();
  });
});
