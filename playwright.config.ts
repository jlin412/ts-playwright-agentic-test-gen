import { defineConfig, devices } from '@playwright/test';

const apiURL = process.env.API_URL ?? 'http://localhost:3000';
const uiURL = process.env.UI_URL ?? 'http://localhost:8080';

export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'], 
    ['html', { open: 'never' }],
  ],
  use: {
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {z
      name: 'api',
      testMatch: /specs\/api\/.*\.spec\.ts/,
      use: {
        baseURL: apiURL,
      },
    },
    {
      name: 'ui-chromium',
      testMatch: /specs\/e2e\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: uiURL,
      },
    },
    {
      name: 'ui-firefox',
      testMatch: /specs\/e2e\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Firefox'],
        baseURL: uiURL,
      },
    },
    {
      name: 'ui-webkit',
      testMatch: /specs\/e2e\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Safari'],
        baseURL: uiURL,
      },
    },
  ],
});
