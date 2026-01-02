import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig, cucumberReporter } from 'playwright-bdd';

const apiURL = process.env.API_URL ?? 'http://localhost:3000';
const uiURL = process.env.UI_URL ?? 'http://localhost:8080';

const testDir = defineBddConfig({
  features: 'bdd/features/*.feature',
  steps: 'bdd/steps/*.ts',
});

export default defineConfig({
  testDir,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'], 
    ['html', { open: 'never' }],
    cucumberReporter('html', { 
      outputFile: 'cucumber-report/index.html',
      externalAttachments: true,
    }),
  ],
  use: {
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'bdd-api',
      testMatch: /.features-gen\/bdd\/features\/smoke-api\.feature\.spec\.js/,
      use: {
        baseURL: apiURL,
      },
    },
    {
      name: 'bdd-ui-chromium',
      testMatch: /.features-gen\/bdd\/features\/(smoke-ui|trace-fail)\.feature\.spec\.js/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: uiURL,
      },
    },
  ],
});
