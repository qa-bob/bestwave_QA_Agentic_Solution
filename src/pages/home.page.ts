import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class HomePage extends BasePage {
  readonly mainHeading: Locator;
  readonly allH2Headings: Locator;
  readonly productLearnMoreLinks: Locator;
  readonly headerLogo: Locator;
  readonly footerLinks: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.mainHeading = page.locator('h1').first();
    this.allH2Headings = page.locator('h2');
    this.productLearnMoreLinks = page.getByRole('link', { name: /learn more/i });
    this.headerLogo = page.locator('img[src*="headerlogo"], img[src*="logo"]').first();
    this.footerLinks = page.locator('footer a, [id*="footer" i] a').first();
  }

  async getHeroText(): Promise<string> {
    const candidates = [
      this.page.getByRole('banner').first(),
      this.page.locator('[data-testid="hero"]').first(),
      this.page.locator('section').first(),
      this.page.locator('header').first(),
    ];

    for (const candidate of candidates) {
      if (await candidate.count() > 0) {
        const text = await candidate.textContent();
        if (text && text.trim().length > 0) {
          return text.trim();
        }
      }
    }

    return '';
  }

  async getCTAButtons(): Promise<Locator[]> {
    const ctaLocator = this.page.locator(
      'a[class*="btn"], a[class*="button"], a[class*="cta"], ' +
      'button[class*="primary"], button[class*="cta"], ' +
      '[role="button"]'
    );

    const all = await ctaLocator.all();

    if (all.length === 0) {
      const textCta = this.page.locator('a, button').filter({
        hasText: /get started|try free|sign up|contact us|learn more|request demo/i,
      });
      return textCta.all();
    }

    return all;
  }

  async getMainHeading(): Promise<string> {
    const h1 = this.page.locator('h1').first();
    if (await h1.count() > 0) {
      return (await h1.textContent())?.trim() ?? '';
    }

    const h2 = this.page.locator('h2').first();
    if (await h2.count() > 0) {
      return (await h2.textContent())?.trim() ?? '';
    }

    return '';
  }

  async getH2Headings(): Promise<string[]> {
    const items = await this.allH2Headings.all();
    const texts: string[] = [];
    for (const item of items) {
      const text = (await item.textContent())?.trim() ?? '';
      if (text) texts.push(text);
    }
    return texts;
  }

  async isLoaded(): Promise<boolean> {
    try {
      const headingCount = await this.page.locator('h1, h2').count();
      if (headingCount === 0) return false;

      const navCount = await this.page.locator('nav, [role="navigation"]').count();
      if (navCount === 0) return false;

      const bodyText = await this.page.evaluate<string>(() => document.body.innerText);
      if (bodyText.trim().length < 50) return false;

      return true;
    } catch {
      return false;
    }
  }
}
