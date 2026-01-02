import { Before, After } from './fixtures';

Before(async function () {
  console.log(`[Before] Starting scenario...`);
});

Before({ tags: '@api' }, async function () {
  console.log(`[Before @api] Preparing API test environment...`);
});

Before({ tags: '@ui' }, async function () {
  console.log(`[Before @ui] Preparing UI test environment...`);
});

After(async function () {
  console.log(`[After] Scenario completed.`);
});

After({ tags: '@ui' }, async function () {
  // Take screenshot on UI test completion for debugging
  console.log(`[After @ui] UI scenario cleanup...`);
});
