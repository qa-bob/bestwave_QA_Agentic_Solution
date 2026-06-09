import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class AboutPage extends BasePage {
  readonly allHeadings: Locator;
  readonly founderImage: Locator;
  readonly companyDescription: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    // Site uses <b>/<strong> for section headings rather than h1-h3
    this.allHeadings = page.locator('h1, h2, h3, b, strong');
    this.founderImage = page.locator('img[src*="glitsos"]');
    this.companyDescription = page.locator('p').first();
  }

  async navigate(): Promise<void> {
    const base = this.config.url.replace(/\/$/, '');
    await this.page.goto(`${base}/About-Best-Wave.php`, { waitUntil: 'domcontentloaded' });
  }

  async getPageHeadings(): Promise<string[]> {
    // Page uses no semantic heading tags; detect known section titles from body text
    const bodyText = await this.page.evaluate<string>(() => document.body.innerText);
    const knownHeadings = [
      'Experience Matters',
      'About Best Wave',
      'Our Mission',
      'Design Philosophy',
      'The Mind',
      'The Heart',
      'The Eye',
    ];
    return knownHeadings.filter((h) => bodyText.includes(h));
  }

  async hasSection(sectionText: string): Promise<boolean> {
    const bodyText = await this.page.evaluate<string>(() => document.body.innerText);
    return bodyText.toLowerCase().includes(sectionText.toLowerCase());
  }
}
