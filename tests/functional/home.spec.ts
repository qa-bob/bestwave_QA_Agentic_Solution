/**
 * tests/functional/home.spec.ts
 *
 * Functional tests for the Best Wave homepage.
 * Verifies business-facing content: headline, product CTAs, differentiators, and sections.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Homepage Functional @functional', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.waitForLoad();
  });

  test('homepage main heading is visible @functional', async ({ homePage }) => {
    await expect(homePage.mainHeading).toBeVisible();
    const heading = await homePage.getMainHeading();
    expect(heading.length).toBeGreaterThan(0);
  });

  test('homepage contains "Best Wave" branding @functional', async ({ homePage }) => {
    const heading = await homePage.getMainHeading();
    const h2Headings = await homePage.getH2Headings();
    const allHeadings = [heading, ...h2Headings].join(' ');
    expect(allHeadings.toLowerCase()).toContain('best wave');
  });

  test('homepage has multiple content sections @functional', async ({ homePage }) => {
    const h2s = await homePage.getH2Headings();
    expect(h2s.length).toBeGreaterThan(1);
  });

  test('homepage has "What is Digital Signage?" section @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(bodyText.toLowerCase()).toContain('digital signage');
  });

  test('homepage has "What are the benefits of digital signs?" section @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(bodyText.toLowerCase()).toContain('benefits');
  });

  test('homepage has applications of digital signage section @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(bodyText.toLowerCase()).toContain('applications');
  });

  test('homepage has "learn more" product CTA links @functional', async ({ homePage }) => {
    const ctaLinks = await homePage.productLearnMoreLinks.all();
    expect(ctaLinks.length).toBeGreaterThan(0);
  });

  test('learn more links reference product pages @functional', async ({ homePage }) => {
    const ctaLinks = await homePage.productLearnMoreLinks.all();
    let productLinkCount = 0;
    for (const link of ctaLinks) {
      const href = (await link.getAttribute('href')) ?? '';
      if (href.includes('Product') || href.includes('product') || href.includes('DisplayIt') || href.includes('ReserveIt') || href.includes('RaceIt')) {
        productLinkCount++;
      }
    }
    expect(productLinkCount).toBeGreaterThan(0);
  });

  test('homepage header logo is present @functional', async ({ homePage }) => {
    const logoCount = await homePage.headerLogo.count();
    expect(logoCount).toBeGreaterThan(0);
  });

  test('homepage is fully loaded @functional', async ({ homePage }) => {
    const loaded = await homePage.isLoaded();
    expect(loaded, 'Homepage should be considered fully loaded').toBeTruthy();
  });
});
