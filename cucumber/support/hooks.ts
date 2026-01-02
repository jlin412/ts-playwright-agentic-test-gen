import { After, Before } from '@cucumber/cucumber';
import { chromium, firefox, webkit, request as playwrightRequest } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

import { RealWorldWorld } from './world.ts';
import { HomePage } from '../../specs/pom/home.page.ts';
import { TagsApi } from '../../specs/som/tags.api.ts';

Before({ tags: '@ui' }, async function (this: RealWorldWorld) {
  const browserName = (process.env.CUCUMBER_BROWSER ?? 'chromium').toLowerCase();
  const browserType =
    browserName === 'firefox' ? firefox : browserName === 'webkit' ? webkit : chromium;

  const headed = ['1', 'true', 'yes'].includes(String(process.env.CUCUMBER_HEADED ?? '').toLowerCase());
  const slowMo = Number(process.env.CUCUMBER_SLOWMO ?? '0') || undefined;

  this.browser = await browserType.launch({
    headless: headed ? false : undefined,
    slowMo,
  });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();

  await this.context.tracing.start({ screenshots: true, snapshots: true, sources: true });

  this.homePage = new HomePage(this.page);
});

After({ tags: '@ui' }, async function (this: RealWorldWorld, scenario) {
  const failed = scenario?.result?.status === 'FAILED';

  const scenarioName = String(scenario?.pickle?.name ?? 'scenario')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // If the scenario failed, write a trace zip to disk and attach pointers to it.
  if (failed && this.context) {
    const tracesDir = path.join('cucumber-report', 'traces');
    await mkdir(tracesDir, { recursive: true });
    const traceRelativePath = path.join(tracesDir, `${scenarioName}.trace.zip`);
    const traceAbsolutePath = path.resolve(traceRelativePath);

    await this.context.tracing.stop({ path: traceRelativePath }).catch(() => undefined);

    // Attach both plain text and HTML so the report shows a clickable link.
    const fileUrl = `file://${traceAbsolutePath}`;
    await this.attach(`Open trace locally: npx playwright show-trace ${traceRelativePath}`, 'text/plain');
    await this.attach(`<a href="${fileUrl}">Open trace file</a>`, 'text/html');
  }

  if (failed && this.page) {
    const screenshotsDir = path.join('cucumber-report', 'screenshots');
    await mkdir(screenshotsDir, { recursive: true });
    const screenshotPath = path.join(screenshotsDir, `${scenarioName}.png`);

    const screenshot = await this.page
      .screenshot({ path: screenshotPath, fullPage: true })
      .catch(() => null);

    if (screenshot) {
      // This is what makes the image show up inside cucumber-report/cucumber.html
      await this.attach(screenshot, 'image/png');
    }
  }

  // If the scenario passed, stop tracing without writing a file.
  if (!failed && this.context) {
    await this.context.tracing.stop().catch(() => undefined);
  }

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
