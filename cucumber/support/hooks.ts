import { After, Before } from '@cucumber/cucumber';
import { chromium, request as playwrightRequest } from 'playwright';

import { RealWorldWorld } from './world.ts';
import { HomePage } from '../../specs/pom/home.page.ts';
import { TagsApi } from '../../specs/som/tags.api.ts';

Before({ tags: '@ui' }, async function (this: RealWorldWorld) {
  this.browser = await chromium.launch();
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();

  this.homePage = new HomePage(this.page);
});

After({ tags: '@ui' }, async function (this: RealWorldWorld) {
  await this.page?.close().catch(() => undefined);
  await this.context?.close().catch(() => undefined);
  await this.browser?.close().catch(() => undefined);

  this.page = null;
  this.context = null;
  this.browser = null;
  this.homePage = null;
});

Before({ tags: '@api' }, async function (this: RealWorldWorld) {
  this.apiRequest = await playwrightRequest.newContext({
    baseURL: this.urls.apiURL,
  });

  this.tagsApi = new TagsApi(this.apiRequest);
});

After({ tags: '@api' }, async function (this: RealWorldWorld) {
  await this.apiRequest?.dispose().catch(() => undefined);

  this.apiRequest = null;
  this.tagsApi = null;
  this.tagsResponse = null;
});
