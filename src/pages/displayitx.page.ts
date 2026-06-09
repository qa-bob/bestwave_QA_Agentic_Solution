import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class DisplayItXPage extends BasePage {
  readonly pageHeading: Locator;
  readonly featureSections: Locator;
  readonly faqLink: Locator;
  readonly brochureLink: Locator;
  readonly tutorialLink: Locator;
  readonly applicationsVideoLink: Locator;
  readonly orderLink: Locator;
  readonly allCtaLinks: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    // Page uses <strong>/<b> for headings; find first with product-related text
    this.pageHeading = page.locator('strong, b').filter({ hasText: /displayit|digital sign|powerpoint|sign/i }).first();
    // Count <strong>/<b> elements as feature section markers
    this.featureSections = page.locator('strong, b').filter({ hasText: /.{10,}/ });
    // Exclude hidden nav-dropdown copies by requiring no <ul> ancestor
    this.faqLink = page.locator('xpath=//a[contains(@href,"DisplayItX-FAQ") and not(ancestor::ul)]');
    this.brochureLink = page.locator('xpath=//a[contains(@href,"DisplayItXBrochure") and not(ancestor::ul)]');
    this.tutorialLink = page.locator('a[href*="DX_Tutorial"], a[href*="tutorial" i]');
    this.applicationsVideoLink = page.locator('a[href*="applications.webm"], a[href*="applications" i]');
    this.orderLink = page.locator('a[href*="cognitoforms"]');
    this.allCtaLinks = page.locator('a[href*=".pdf"], a[href*=".mp4"], a[href*=".webm"], a[href*="FAQ"]');
  }

  async navigate(): Promise<void> {
    const base = this.config.url.replace(/\/$/, '');
    await this.page.goto(`${base}/DisplayItX-Product.php`, { waitUntil: 'domcontentloaded' });
  }

  async getFeatureCount(): Promise<number> {
    return this.featureSections.count();
  }

  async getFeatureHeadings(): Promise<string[]> {
    const items = await this.featureSections.all();
    const texts: string[] = [];
    for (const item of items) {
      const text = (await item.textContent())?.trim() ?? '';
      if (text) texts.push(text);
    }
    return texts;
  }
}
