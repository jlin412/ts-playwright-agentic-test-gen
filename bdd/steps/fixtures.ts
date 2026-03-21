import { test as base } from 'playwright-bdd';
import { expect } from '@playwright/test';

import { HomePage } from '../../pom/home.page';
import { TagsApi } from '../../som/tags.api';

export const test = base.extend<{
  homePage: HomePage;
  tagsApi: TagsApi;
}>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  tagsApi: async ({ request }, use) => {
    await use(new TagsApi(request));
  },
});

export { expect };
