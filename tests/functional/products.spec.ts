/**
 * tests/functional/products.spec.ts
 *
 * Functional tests for the Best Wave Products overview page.
 * Verifies all product offerings are listed and navigable.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Products Page @functional', () => {
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.navigate();
    await productsPage.waitForLoad();
  });

  test('products page loads with a visible heading @functional', async ({ productsPage }) => {
    await expect(productsPage.pageHeading).toBeVisible();
    const text = await productsPage.pageHeading.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('products page title contains Best Wave @functional', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('Best Wave');
  });

  test('products page has multiple product sections @functional', async ({ productsPage }) => {
    const headings = await productsPage.getProductHeadings();
    expect(headings.length).toBeGreaterThan(1);
  });

  test('DisplayIt!Xpress product link is present @functional', async ({ productsPage }) => {
    const count = await productsPage.displayItXpressLink.count();
    expect(count, 'DisplayIt!Xpress product link should exist on the products page').toBeGreaterThan(0);
    await expect(productsPage.displayItXpressLink.first()).toBeVisible();
  });

  test('ReserveIt! product link is present @functional', async ({ productsPage }) => {
    const count = await productsPage.reserveItLink.count();
    expect(count, 'ReserveIt! product link should exist on the products page').toBeGreaterThan(0);
    await expect(productsPage.reserveItLink.first()).toBeVisible();
  });

  test('SignBlaster! product link is present @functional', async ({ productsPage }) => {
    const count = await productsPage.signBlasterLink.count();
    expect(count, 'SignBlaster! product link should exist on the products page').toBeGreaterThan(0);
    await expect(productsPage.signBlasterLink.first()).toBeVisible();
  });

  test('ExploreIt! product link is present @functional', async ({ productsPage }) => {
    const count = await productsPage.exploreItLink.count();
    expect(count, 'ExploreIt! product link should exist on the products page').toBeGreaterThan(0);
    await expect(productsPage.exploreItLink.first()).toBeVisible();
  });

  test('products page mentions PowerPoint-based content creation @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(bodyText.toLowerCase()).toContain('powerpoint');
  });

  test('DisplayIt!Xpress link navigates to its product detail page @functional', async ({ productsPage, page }) => {
    await productsPage.displayItXpressLink.first().click();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('DisplayItX-Product');
  });

  test('ReserveIt! link navigates to its product detail page @functional', async ({ productsPage, page }) => {
    await productsPage.reserveItLink.first().click();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('ReserveIt-Product');
  });
});
