import { expect, type APIRequestContext } from '@playwright/test';

type TagsResponse = {
  tags: string[];
};

export class TagsApi {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

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
}
