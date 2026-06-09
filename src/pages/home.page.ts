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
    // Site uses no h1/h2; find first visible element containing a known section phrase
    this.mainHeading = page.getByText(/What makes Best Wave|What is Digital Signage|digital sign software/i).first();
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
    // Page has no h1/h2; return title text as the "main heading"
    return this.page.title();
  }

  async getH2Headings(): Promise<string[]> {
    // Page uses no h2 tags; return known content section names from body text
    const bodyText = await this.page.evaluate<string>(() => document.body.innerText);
    const knownSections = [
      'What makes Best Wave Different',
      'What is Digital Signage',
      'What are the benefits',
      'Applications of Digital Signage',
    ];
    return knownSections.filter((s) => bodyText.includes(s));
  }

  async isLoaded(): Promise<boolean> {
    try {
      // Page has no h1/h2; verify a visible nav link and page content are present
      const hasNavLink = await this.page
        .locator('a[href*="About-Best-Wave"]').first()
        .isVisible()
        .catch(() => false);
      if (!hasNavLink) return false;

      const bodyText = await this.page.evaluate<string>(() => document.body.innerText);
      if (bodyText.trim().length < 50) return false;
      if (!bodyText.toLowerCase().includes('best wave')) return false;

      return true;
    } catch {
      return false;
    }
  }
}
