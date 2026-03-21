import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';

const { Before, After } = createBdd(test);

Before(async ({}) => {
  console.log(`[Before] Starting scenario...`);
});

Before({ tags: '@api' }, async ({ tagsApi }) => {
  console.log(`[Before @api] Preparing API test environment...`);
});

Before({ tags: '@ui' }, async ({ page }) => {
  console.log(`[Before @ui] Preparing UI test environment...`);
});

After(async ({}) => {
  console.log(`[After] Scenario completed.`);
});

After({ tags: '@ui' }, async ({ page }) => {
  // Take screenshot on UI test completion for debugging
  console.log(`[After @ui] UI scenario cleanup...`);
});
