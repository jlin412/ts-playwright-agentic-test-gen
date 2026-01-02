import { test as base, createBdd } from 'playwright-bdd';
import { type Page, expect, type APIRequestContext } from '@playwright/test';

import { HomePage } from '../../specs/pom/home.page';
import { TagsApi } from '../../specs/som/tags.api';

type ApiState = {
  tagsResponse?: { tags: string[] };
};

type Fixtures = {
  page: Page;
  request: APIRequestContext;

  homePage: HomePage;
  tagsApi: TagsApi;
  apiState: ApiState;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  tagsApi: async ({ request }, use) => {
    await use(new TagsApi(request));
  },
  apiState: async ({}, use) => {
    await use({});
  },
});

// Playwright-style steps: fixtures are the first arg.
export const { Given, When, Then } = createBdd(test);

export { expect };
