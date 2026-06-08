import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class AboutPage extends BasePage {
  readonly allHeadings: Locator;
  readonly founderImage: Locator;
  readonly companyDescription: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.allHeadings = page.locator('h1, h2, h3');
    this.founderImage = page.locator('img[src*="glitsos"]');
    this.companyDescription = page.locator('p').first();
  }

  async navigate(): Promise<void> {
    const base = this.config.url.replace(/\/$/, '');
    await this.page.goto(`${base}/About-Best-Wave.php`, { waitUntil: 'domcontentloaded' });
  }

  async getPageHeadings(): Promise<string[]> {
    const items = await this.allHeadings.all();
    const texts: string[] = [];
    for (const item of items) {
      const text = (await item.textContent())?.trim() ?? '';
      if (text) texts.push(text);
    }
    return texts;
  }

  async hasSection(sectionText: string): Promise<boolean> {
    const bodyText = await this.page.evaluate<string>(() => document.body.innerText);
    return bodyText.toLowerCase().includes(sectionText.toLowerCase());
  }
}
