import { expect, test } from '../fixtures';

// Intentionally failing test to validate Playwright Trace Viewer.
// Trace is retained on failure via playwright.config.ts (trace: 'retain-on-failure').

test.describe('Trace viewer demo', () => {
  test('intentional failure generates trace', async ({ homePage }) => {
    await homePage.goto();
    await homePage.expectLoaded();

    // Fail fast (so you don't wait for the default expect timeout).
    await expect(
      homePage.page.getByRole('heading', { name: 'definitely-not-a-real-heading' }),
    ).toBeVisible({ timeout: 1000 });
  });
});
