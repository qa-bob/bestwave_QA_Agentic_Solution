/**
 * tests/functional/about.spec.ts
 *
 * Functional tests for the Best Wave About / History page.
 * Verifies company information, sections, and team presence.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('About Page @functional', () => {
  test.beforeEach(async ({ aboutPage }) => {
    await aboutPage.navigate();
    await aboutPage.waitForLoad();
  });

  test('about page loads with visible headings @functional', async ({ aboutPage }) => {
    const headings = await aboutPage.getPageHeadings();
    expect(headings.length, 'About page should have at least one heading').toBeGreaterThan(0);
  });

  test('about page title contains Best Wave @functional', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('Best Wave');
  });

  test('"Experience Matters" section is present @functional', async ({ page }) => {
    const heading = page.getByText('Experience Matters', { exact: false });
    await expect(heading.first()).toBeVisible();
  });

  test('"About Best Wave" section is present @functional', async ({ page }) => {
    const heading = page.getByText('About Best Wave', { exact: false });
    await expect(heading.first()).toBeVisible();
  });

  test('"Design Philosophy" section is present @functional', async ({ aboutPage }) => {
    const hasSection = await aboutPage.hasSection('Design Philosophy');
    expect(hasSection, '"Design Philosophy" content should be on the About page').toBeTruthy();
  });

  test('about page mentions company founding history @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    const lower = bodyText.toLowerCase();
    expect(
      lower.includes('founded') || lower.includes('1990') || lower.includes('first wave'),
      'About page should reference company founding history'
    ).toBeTruthy();
  });

  test('about page mentions software development experience @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(bodyText.toLowerCase()).toContain('software');
  });

  test('founder or leadership content is present @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      bodyText.toLowerCase().includes('glitsos') || bodyText.toLowerCase().includes('founder') || bodyText.toLowerCase().includes('co-founder'),
      'About page should mention company leadership'
    ).toBeTruthy();
  });

  test('about page has navigation back to homepage @functional', async ({ page, siteConfig }) => {
    const homeLink = page.locator(`a[href*="index.php"], a[href="${siteConfig.url}"], a[href="/"]`).first();
    const count = await homeLink.count();
    expect(count, 'About page should have a link back to the homepage').toBeGreaterThan(0);
  });
});
