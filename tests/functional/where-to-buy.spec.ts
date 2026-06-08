/**
 * tests/functional/where-to-buy.spec.ts
 *
 * Functional tests for the Best Wave Where to Buy page.
 * Verifies regional sections and partner/distributor information.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Where to Buy Page @functional', () => {
  test.beforeEach(async ({ whereToBuyPage }) => {
    await whereToBuyPage.navigate();
    await whereToBuyPage.waitForLoad();
  });

  test('page loads with region headings @functional', async ({ whereToBuyPage }) => {
    const regions = await whereToBuyPage.getRegionNames();
    expect(regions.length, 'Where to Buy page should have at least one region heading').toBeGreaterThan(0);
  });

  test('page title contains Best Wave @functional', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('Best Wave');
  });

  test('"North America" region section is present @functional', async ({ whereToBuyPage }) => {
    await expect(whereToBuyPage.northAmericaHeading).toBeVisible();
  });

  test('"Europe" region section is present @functional', async ({ whereToBuyPage }) => {
    await expect(whereToBuyPage.europeHeading).toBeVisible();
  });

  test('North American distributor names are listed @functional', async ({ whereToBuyPage }) => {
    const bodyText = await whereToBuyPage.getBodyText();
    const lower = bodyText.toLowerCase();
    const knownPartners = ['displays2go', 'viewsonic', 'cdw', 'insight', 'microage'];
    const found = knownPartners.filter((p) => lower.includes(p));
    expect(
      found.length,
      `At least one known North American partner should be listed. Found: ${found.join(', ')}`
    ).toBeGreaterThan(0);
  });

  test('European partner information is present @functional', async ({ whereToBuyPage }) => {
    const bodyText = await whereToBuyPage.getBodyText();
    const lower = bodyText.toLowerCase();
    expect(
      lower.includes('hamburg') || lower.includes('sirkom') || lower.includes('europe'),
      'European partner details should be present on the page'
    ).toBeTruthy();
  });

  test('contact link is accessible from where-to-buy page @functional', async ({ page, siteConfig }) => {
    const contactLink = page.locator(`a[href*="Contact"], a[href*="contact"]`).first();
    const count = await contactLink.count();
    expect(count, 'A contact link should be accessible from the Where to Buy page').toBeGreaterThan(0);
  });
});
