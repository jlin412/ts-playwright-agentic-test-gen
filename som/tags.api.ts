import { expect, type APIRequestContext } from '@playwright/test';
import { Fixture, Given, When, Then } from 'playwright-bdd/decorators';
import type { test } from '../bdd/steps/fixtures';

type TagsResponse = {
  tags: string[];
};

@Fixture<typeof test>('tagsApi')
export class TagsApi {
  private tagsResponse?: TagsResponse;

  constructor(readonly request: APIRequestContext) {}

  async waitUntilReady() {
    await expect
      .poll(
        async () => {
          try {
            const r = await this.request.get('/api/tags');
            return r.status();
          } catch {
            return 0;
          }
        },
        {
          timeout: 15_000,
          intervals: [250, 500, 1000],
          message: 'Waiting for API to become ready at /api/tags',
        },
      )
      .toBe(200);
  }

  async getTags(): Promise<TagsResponse> {
    const res = await this.request.get('/api/tags');
    expect(res.ok()).toBeTruthy();
    return (await res.json()) as TagsResponse;
  }

  @Given('the API is ready')
  async apiReady() {
    await this.waitUntilReady();
  }

  @When('I request tags')
  async requestTags() {
    this.tagsResponse = await this.getTags();
  }

  @Then('tags array is returned')
  async checkTagsArray() {
    expect(this.tagsResponse, 'tags response should be captured').toBeTruthy();
    expect(this.tagsResponse).toHaveProperty('tags');
    expect(Array.isArray(this.tagsResponse?.tags)).toBe(true);
  }
}
