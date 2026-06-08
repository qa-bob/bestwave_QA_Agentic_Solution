/**
 * tests/functional/support.spec.ts
 *
 * Functional tests for the Best Wave Support page.
 * Verifies support sections, download links, and FAQ navigation.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Support Page @functional', () => {
  test.beforeEach(async ({ supportPage }) => {
    await supportPage.navigate();
    await supportPage.waitForLoad();
  });

  test('support page loads with section headings @functional', async ({ supportPage }) => {
    const sections = await supportPage.getSupportSections();
    expect(sections.length, 'Support page should have multiple section headings').toBeGreaterThan(0);
  });

  test('support page title contains Best Wave @functional', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('Best Wave');
  });

  test('maintenance plans section is present @functional', async ({ page }) => {
    const heading = page.getByText('MAINTENANCE PLANS', { exact: false });
    await expect(heading.first()).toBeVisible();
  });

  test('email support section is present @functional', async ({ page }) => {
    const heading = page.getByText('E-MAIL SUPPORT', { exact: false });
    await expect(heading.first()).toBeVisible();
  });

  test('telephone support section is present @functional', async ({ page }) => {
    const heading = page.getByText('TELEPHONE SUPPORT', { exact: false });
    await expect(heading.first()).toBeVisible();
  });

  test('user guide download section is present @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      bodyText.toLowerCase().includes('user guide') || bodyText.toLowerCase().includes('download'),
      'Support page should mention user guides or downloads'
    ).toBeTruthy();
  });

  test('price list PDF link is present @functional', async ({ supportPage }) => {
    const count = await supportPage.priceListLink.count();
    expect(count, 'Price list PDF link should exist on the support page').toBeGreaterThan(0);
    await expect(supportPage.priceListLink.first()).toBeVisible();
  });

  test('FAQ links are present @functional', async ({ supportPage }) => {
    const count = await supportPage.faqLinks.count();
    expect(count, 'At least one FAQ link should be present on the support page').toBeGreaterThan(0);
  });

  test('download links (PDF/EXE/APK) are present @functional', async ({ supportPage }) => {
    const count = await supportPage.allDownloadLinks.count();
    expect(count, 'At least one downloadable file link should be on the support page').toBeGreaterThan(0);
  });

  test('DisplayIt!Xpress FAQ link is present @functional', async ({ supportPage }) => {
    const count = await supportPage.displayItXFaqLink.count();
    expect(count, 'DisplayIt!Xpress FAQ link should be on the support page').toBeGreaterThan(0);
  });

  test('DisplayIt!Xpress FAQ link navigates to FAQ page @functional', async ({ supportPage, page }) => {
    await supportPage.displayItXFaqLink.first().click();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('FAQ');
  });
});
