import {
  type APIRequestContext,
  type Browser,
  type BrowserContext,
  type Page,
} from 'playwright';
import { setWorldConstructor, World } from '@cucumber/cucumber';

import { HomePage } from '../../specs/pom/home.page.ts';
import { TagsApi } from '../../specs/som/tags.api.ts';

type URLs = {
  apiURL: string;
  uiURL: string;
};

export class RealWorldWorld extends World {
  urls: URLs;

  browser: Browser | null = null;
  context: BrowserContext | null = null;
  page: Page | null = null;

  apiRequest: APIRequestContext | null = null;

  homePage: HomePage | null = null;
  tagsApi: TagsApi | null = null;

  tagsResponse: unknown = null;

  constructor(options: any) {
    super(options);

    this.urls = {
      apiURL: process.env.API_URL ?? 'http://localhost:3000',
      uiURL: process.env.UI_URL ?? 'http://localhost:8080',
    };
  }
}

setWorldConstructor(RealWorldWorld);
