/**
 * tests/visual/visual-regression.spec.ts
 *
 * Visual regression tests — compare screenshots against stored baselines.
 * Run `npm run baseline` to capture new baselines after intentional design changes.
 *
 * NOTE: Screenshots are captured via CDP's Page.captureScreenshot rather than
 * Playwright's page.screenshot() / toHaveScreenshot(). Both of those APIs wait
 * for document.fonts.ready, which hangs indefinitely on bestwave.com because the
 * 1990s server drops CSS/font resource connections under concurrent load without
 * sending an error response, leaving document.fonts.ready perpetually pending.
 * The CDP call captures the current rendered state immediately.
 *
 * Images are hidden before each screenshot so the comparison is deterministic —
 * bestwave.com's splash hero image loads non-deterministically on the slow server,
 * causing false positives. The tests verify layout structure, not image content.
 *
 * Each test runs only in the Playwright project whose viewport it targets, and
 * is skipped (not failed) until a baseline has been captured for it.
 *
 * Tag: @visual
 */

import * as fs from 'fs';
import { test, expect } from '@fixtures/site.fixture';
import { dismissCookieBanner } from '@utils/visual-helper';
import type { Page, TestInfo } from '@playwright/test';

const SNAPSHOT_OPTIONS = {
  // 5% ratio covers non-deterministic rendering on bestwave.com's legacy server (observed
  // up to ~3% diff between runs even with images hidden). Major layout regressions
  // (missing sections, wrong structure) cause 10%+ diff and will still be caught.
  maxDiffPixelRatio: 0.05,
} as const;

/** Hide all <img> elements so screenshots are deterministic regardless of load state. */
async function hideImages(page: Page): Promise<void> {
  await page.evaluate(() => {
    document.querySelectorAll('img').forEach((img) => {
      (img as HTMLElement).style.visibility = 'hidden';
    });
  });
}

/** Take a CDP screenshot (bypasses Playwright's font-ready wait). */
async function cdpScreenshot(page: Page): Promise<Buffer> {
  const client = await page.context().newCDPSession(page);
  const { data } = await client.send('Page.captureScreenshot', { format: 'png' });
  await client.detach();
  return Buffer.from(data, 'base64');
}

/**
 * Skip unless running in `project`, and skip (not fail) until a baseline exists.
 * Only `--update-snapshots` (all/changed) should create a missing baseline.
 */
function skipUnlessBaseline(testInfo: TestInfo, project: string, snapshot: string): void {
  test.skip(testInfo.project.name !== project, `Runs only in the "${project}" project`);
  const isUpdating = ['all', 'changed'].includes(testInfo.config.updateSnapshots);
  const baselinePath = testInfo.snapshotPath(snapshot, { kind: 'snapshot' });
  test.skip(
    !isUpdating && !fs.existsSync(baselinePath),
    `No baseline at ${baselinePath} — run "npm run baseline" to capture one`
  );
}

test.describe('Visual Regression @visual', () => {
  // Run serially so tests don't compete for the server's limited connections.
  test.describe.configure({ mode: 'serial', timeout: 60_000 });

  test.beforeEach(async ({ siteConfig }) => {
    if (siteConfig.skipVisual) {
      test.skip(true, `Visual regression skipped for "${siteConfig.name}" (skipVisual: true)`);
    }
  });

  // ── Desktop ─────────────────────────────────────────────────────────────────

  test('homepage visual regression - desktop @visual', async ({ page, siteConfig }, testInfo) => {
    skipUnlessBaseline(testInfo, 'chromium-desktop', 'homepage-desktop.png');

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    await dismissCookieBanner(page);
    await hideImages(page);

    expect(await cdpScreenshot(page)).toMatchSnapshot('homepage-desktop.png', SNAPSHOT_OPTIONS);
  });

  // ── Mobile ──────────────────────────────────────────────────────────────────

  test('homepage visual regression - mobile @visual', async ({ page, siteConfig }, testInfo) => {
    skipUnlessBaseline(testInfo, 'mobile-chrome', 'homepage-mobile.png');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    await dismissCookieBanner(page);
    await hideImages(page);

    expect(await cdpScreenshot(page)).toMatchSnapshot('homepage-mobile.png', SNAPSHOT_OPTIONS);
  });

  // ── Tablet ──────────────────────────────────────────────────────────────────

  test('homepage visual regression - tablet @visual', async ({ page, siteConfig }, testInfo) => {
    skipUnlessBaseline(testInfo, 'tablet', 'homepage-tablet.png');

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    await dismissCookieBanner(page);
    await hideImages(page);

    expect(await cdpScreenshot(page)).toMatchSnapshot('homepage-tablet.png', SNAPSHOT_OPTIONS);
  });
});
