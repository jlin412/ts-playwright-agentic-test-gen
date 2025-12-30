import { expect, test } from '../fixtures';

test.describe('API smoke', () => {
  test('GET /api/tags returns tags array', async ({ tagsApi, baseURL }) => {
    expect(baseURL, 'baseURL must be configured for api project').toBeTruthy();

    await tagsApi.waitUntilReady();

    const body = await tagsApi.getTags();
    expect(body).toHaveProperty('tags');
    expect(Array.isArray(body.tags)).toBe(true);
  });
});
