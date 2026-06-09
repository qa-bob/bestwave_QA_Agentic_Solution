import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class WhereToBuyPage extends BasePage {
  readonly regionHeadings: Locator;
  readonly externalPartnerLinks: Locator;
  readonly northAmericaHeading: Locator;
  readonly europeHeading: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.regionHeadings = page.locator('h2');
    this.externalPartnerLinks = page.locator('a[href*="sirkom"], a[href*="displays2go"], a[href*="viewsonic"], a[href*="cdw"], a[href*="insight"], a[href*="microage"]');
    this.northAmericaHeading = page.getByText('North America', { exact: false }).first();
    this.europeHeading = page.getByText('Europe', { exact: false }).first();
  }

  async navigate(): Promise<void> {
    const base = this.config.url.replace(/\/$/, '');
    await this.page.goto(`${base}/Where-To-Buy-Best-Wave-Products.php`, { waitUntil: 'domcontentloaded' });
  }

  async getRegionNames(): Promise<string[]> {
    // Page uses no h2 tags; detect region names from body text
    const bodyText = await this.page.evaluate<string>(() => document.body.innerText);
    const regions: string[] = [];
    if (bodyText.includes('North America')) regions.push('North America');
    if (bodyText.toLowerCase().includes('europe')) regions.push('Europe');
    if (bodyText.toLowerCase().includes('asia') || bodyText.toLowerCase().includes('pacific')) regions.push('Asia/Pacific');
    return regions;
  }

  async getBodyText(): Promise<string> {
    return this.page.evaluate<string>(() => document.body.innerText);
  }
}
