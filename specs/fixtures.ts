import { test as base, expect } from '@playwright/test';

import { HomePage } from './pom/home.page';
import { TagsApi } from './som/tags.api';

type Fixtures = {
  homePage: HomePage;
  tagsApi: TagsApi;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  tagsApi: async ({ request }, use) => {
    await use(new TagsApi(request));
  },
});

export { expect };
