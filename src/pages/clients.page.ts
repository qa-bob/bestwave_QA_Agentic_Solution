import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class ClientsPage extends BasePage {
  readonly clientLogosImage: Locator;
  readonly digitalSignageLink: Locator;
  readonly interactiveKiosksLink: Locator;
  readonly allImages: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.clientLogosImage = page.locator('img[src*="alllogos"], img[src*="logo"]').first();
    this.digitalSignageLink = page.locator('a[href*="Digital-Sign-Client-Gallery"]');
    this.interactiveKiosksLink = page.locator('a[href*="Interactive-Case-Studies"]');
    this.allImages = page.locator('img');
  }

  async navigate(): Promise<void> {
    const base = this.config.url.replace(/\/$/, '');
    await this.page.goto(`${base}/Digital-Sign-Client-Gallery.php`, { waitUntil: 'domcontentloaded' });
  }

  async getImageCount(): Promise<number> {
    return this.allImages.count();
  }
}
