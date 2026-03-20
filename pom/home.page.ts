import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly brandLink: Locator;
  readonly bannerHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.brandLink = page.getByRole('link', { name: 'conduit' });
    this.bannerHeading = page.getByRole('heading', { name: 'conduit' });
  }

  async goto(baseURL?: string) {
    if (baseURL) {
      await this.page.goto(new URL('/', baseURL).toString());
      return;
    }

    await this.page.goto('/');
  }

  async expectLoaded() {
    await expect(this.bannerHeading).toBeVisible();
    await expect(this.brandLink).toBeVisible();
  }
}
