import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class ProductsPage extends BasePage {
  readonly pageHeading: Locator;
  readonly allH2Headings: Locator;
  readonly displayItXpressLink: Locator;
  readonly signBlasterLink: Locator;
  readonly reserveItLink: Locator;
  readonly exploreItLink: Locator;
  readonly raceItLink: Locator;
  readonly learnMoreLinks: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.pageHeading = page.locator('h1').first();
    this.allH2Headings = page.locator('h2');
    this.displayItXpressLink = page.locator('a[href*="DisplayItX-Product"]');
    this.signBlasterLink = page.locator('a[href*="SignBlaster-Product"]');
    this.reserveItLink = page.locator('a[href*="ReserveIt-Product"]');
    this.exploreItLink = page.locator('a[href*="ExploreIt-Product"]');
    this.raceItLink = page.locator('a[href*="RaceIt"]');
    this.learnMoreLinks = page.getByRole('link', { name: /learn more/i });
  }

  async navigate(): Promise<void> {
    const base = this.config.url.replace(/\/$/, '');
    await this.page.goto(`${base}/Best-Wave-Products.php`, { waitUntil: 'domcontentloaded' });
  }

  async getProductHeadings(): Promise<string[]> {
    const items = await this.allH2Headings.all();
    const texts: string[] = [];
    for (const item of items) {
      const text = (await item.textContent())?.trim() ?? '';
      if (text) texts.push(text);
    }
    return texts;
  }
}
