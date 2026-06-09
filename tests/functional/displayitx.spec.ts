/**
 * tests/functional/displayitx.spec.ts
 *
 * Functional tests for the DisplayIt!Xpress product detail page.
 * Verifies feature sections, resource links, and CTA presence.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('DisplayIt!Xpress Product Page @functional', () => {
  test.beforeEach(async ({ displayItXPage }) => {
    await displayItXPage.navigate();
    await displayItXPage.waitForLoad();
  });

  test('page loads with a visible heading @functional', async ({ displayItXPage }) => {
    await expect(displayItXPage.pageHeading).toBeVisible();
    const text = await displayItXPage.pageHeading.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('page title references DisplayIt or Best Wave @functional', async ({ page }) => {
    const title = await page.title();
    const lower = title.toLowerCase();
    expect(lower.includes('displayit') || lower.includes('best wave')).toBeTruthy();
  });

  test('page has multiple feature section headings @functional', async ({ displayItXPage }) => {
    const count = await displayItXPage.getFeatureCount();
    expect(count, 'DisplayIt!Xpress should have multiple feature sections (h2)').toBeGreaterThan(3);
  });

  test('page describes PowerPoint content creation @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(bodyText.toLowerCase()).toContain('powerpoint');
  });

  test('page mentions no recurring fees @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(bodyText.toLowerCase()).toContain('no recurring');
  });

  test('FAQ link is present @functional', async ({ displayItXPage }) => {
    // Link exists on the page but may be in a non-visible layout container
    const count = await displayItXPage.faqLink.count();
    expect(count, 'FAQ link should be present on the DisplayIt!Xpress page').toBeGreaterThan(0);
  });

  test('product brochure PDF link is present @functional', async ({ displayItXPage }) => {
    // Link exists on the page but may be in a non-visible layout container
    const count = await displayItXPage.brochureLink.count();
    expect(count, 'Product brochure PDF link should be present').toBeGreaterThan(0);
  });

  test('tutorial video link is present @functional', async ({ displayItXPage }) => {
    const count = await displayItXPage.tutorialLink.count();
    expect(count, 'Tutorial link should be present on the product page').toBeGreaterThan(0);
  });

  test('emergency broadcast feature is mentioned @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(bodyText.toLowerCase()).toContain('emergency');
  });

  test('FAQ link navigates to FAQ page @functional', async ({ displayItXPage, page }) => {
    // force:true is required because the link may be in a hidden layout container
    await displayItXPage.faqLink.first().click({ force: true });
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('FAQ');
  });
});
