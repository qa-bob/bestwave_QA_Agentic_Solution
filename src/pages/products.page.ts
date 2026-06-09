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
    // Site uses no h1/h2; find first visible element with product-related text
    this.pageHeading = page.getByText(/digital sign|product|displayit|signblaster|reserveit/i).first();
    this.allH2Headings = page.locator('h2');
    // Filter to "Learn More" text to skip hidden nav-dropdown copies of these links
    this.displayItXpressLink = page.locator('a[href*="DisplayItX-Product"]').filter({ hasText: /learn more/i });
    this.signBlasterLink = page.locator('a[href*="SignBlaster-Product"]').filter({ hasText: /learn more/i });
    this.reserveItLink = page.locator('a[href*="ReserveIt-Product"]').filter({ hasText: /learn more/i });
    this.exploreItLink = page.locator('a[href*="ExploreIt-Product"]').filter({ hasText: /learn more/i });
    this.raceItLink = page.locator('a[href*="RaceIt"]');
    this.learnMoreLinks = page.getByRole('link', { name: /learn more/i });
  }

  async navigate(): Promise<void> {
    const base = this.config.url.replace(/\/$/, '');
    await this.page.goto(`${base}/Best-Wave-Products.php`, { waitUntil: 'domcontentloaded' });
  }

  async getProductHeadings(): Promise<string[]> {
    // Page uses no h2 tags; return known product names present in the body text
    const bodyText = await this.page.evaluate<string>(() => document.body.innerText);
    const products = ['DisplayIt!Xpress', 'ReserveIt!', 'SignBlaster!', 'ExploreIt!', 'RaceIt!'];
    return products.filter((p) => bodyText.includes(p));
  }
}
