import { test as base, createBdd } from 'playwright-bdd';
import { type Page, expect, type APIRequestContext, type BrowserContext } from '@playwright/test';

import { HomePage } from '../../specs/pom/home.page';
import { TagsApi } from '../../specs/som/tags.api';

type ApiState = {
  tagsResponse?: { tags: string[] };
};

// World class for Cucumber-style steps
export class World {
  page!: Page;
  request!: APIRequestContext;
  context!: BrowserContext;

  homePage!: HomePage;
  tagsApi!: TagsApi;
  apiState: ApiState = {};

  constructor(
    public readonly $page: Page,
    public readonly $request: APIRequestContext,
    public readonly $context: BrowserContext,
  ) {
    this.page = $page;
    this.request = $request;
    this.context = $context;
  }

  async init() {
    this.homePage = new HomePage(this.page);
    this.tagsApi = new TagsApi(this.request);
    this.apiState = {};
  }
}

type WorldFixture = {
  world: World;
};

export const test = base.extend<WorldFixture>({
  world: async ({ page, request, context }, use) => {
    const world = new World(page, request, context);
    await world.init();
    await use(world);
  },
});

// Cucumber-style steps: access fixtures via `this` (World instance)
export const { Given, When, Then, Before, After } = createBdd(test, {
  worldFixture: 'world',
});

export { expect };
