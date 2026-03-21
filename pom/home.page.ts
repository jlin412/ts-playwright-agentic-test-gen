import { expect, type Locator, type Page } from '@playwright/test';
import { Fixture, Given, Then } from 'playwright-bdd/decorators';
import type { test } from '../bdd/steps/fixtures';

@Fixture<typeof test>('homePage')
export class HomePage {
  readonly brandLink: Locator;
  readonly bannerHeading: Locator;

  constructor(readonly page: Page) {
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

  @Given('I am on the home page')
  async open() {
    await this.goto();
  }

  @Then('the home page is loaded')
  async checkLoaded() {
    await this.expectLoaded();
  }

  @Then('I should see a non-existent heading')
  async checkNonExistentHeading() {
    await expect(
      this.page.getByRole('heading', { name: 'definitely-not-a-real-heading' }),
    ).toBeVisible({ timeout: 1000 });
  }
}
