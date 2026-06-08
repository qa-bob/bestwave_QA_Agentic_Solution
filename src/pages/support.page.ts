import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class SupportPage extends BasePage {
  readonly allH2Headings: Locator;
  readonly priceListLink: Locator;
  readonly faqLinks: Locator;
  readonly pdfDownloadLinks: Locator;
  readonly executableDownloadLinks: Locator;
  readonly allDownloadLinks: Locator;
  readonly displayItXFaqLink: Locator;
  readonly reserveItFaqLink: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.allH2Headings = page.locator('h2');
    this.priceListLink = page.locator('a[href*="PriceList"]');
    this.faqLinks = page.locator('a[href*="FAQ"]');
    this.pdfDownloadLinks = page.locator('a[href$=".pdf"]');
    this.executableDownloadLinks = page.locator('a[href$=".exe"], a[href$=".apk"]');
    this.allDownloadLinks = page.locator('a[href$=".pdf"], a[href$=".exe"], a[href$=".apk"]');
    this.displayItXFaqLink = page.locator('a[href*="DisplayItX-FAQ"]');
    this.reserveItFaqLink = page.locator('a[href*="ReserveIt-FAQ"]');
  }

  async navigate(): Promise<void> {
    const base = this.config.url.replace(/\/$/, '');
    await this.page.goto(`${base}/Best-Wave-Support.php`, { waitUntil: 'domcontentloaded' });
  }

  async getSupportSections(): Promise<string[]> {
    const items = await this.allH2Headings.all();
    const texts: string[] = [];
    for (const item of items) {
      const text = (await item.textContent())?.trim() ?? '';
      if (text) texts.push(text);
    }
    return texts;
  }
}
