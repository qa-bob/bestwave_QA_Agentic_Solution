import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export interface FormFieldInfo {
  name: string;
  type: string;
  required: boolean;
}

export class ContactFormPage extends BasePage {
  // ── Bestwave-specific field locators ─────────────────────────────────────────
  readonly nameField: Locator;
  readonly companyField: Locator;
  readonly emailField: Locator;
  readonly phoneField: Locator;
  readonly sendToDropdown: Locator;
  readonly subjectDropdown: Locator;
  readonly messageTextarea: Locator;
  readonly submitButton: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    // Use label-text matching first; fall back to positional/attribute selectors
    this.nameField = page.getByLabel(/^name/i).first();
    this.companyField = page.getByLabel(/company/i).first();
    this.emailField = page.getByLabel(/email/i).first();
    this.phoneField = page.getByLabel(/phone/i).first();
    this.sendToDropdown = page.getByLabel(/send to/i).first();
    this.subjectDropdown = page.getByLabel(/subject/i).first();
    this.messageTextarea = page.locator('textarea').first();
    this.submitButton = page.locator('input[type="submit"], button[type="submit"]')
      .or(page.getByRole('button', { name: /send/i }))
      .first();
  }

  async navigateToContactPage(): Promise<void> {
    const base = this.config.url.replace(/\/$/, '');
    await this.page.goto(`${base}/Best-Wave-Contact-Form.php`, { waitUntil: 'domcontentloaded' });
  }

  // ── Generic form discovery ───────────────────────────────────────────────────

  async findContactForm(): Promise<Locator | null> {
    const byAction = this.page.locator('form[action*="contact" i], form[action*="message" i]');
    if (await byAction.count() > 0) return byAction.first();

    const withEmail = this.page.locator('form').filter({
      has: this.page.locator('input[type="email"], input[name*="email" i]'),
    });
    if (await withEmail.count() > 0) return withEmail.first();

    const anyForm = this.page.locator('form').first();
    if (await anyForm.count() > 0) return anyForm;

    return null;
  }

  async getFormFields(): Promise<FormFieldInfo[]> {
    const form = await this.findContactForm();
    if (!form) return [];

    const inputLocator = form.locator(
      'input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select'
    );
    const count = await inputLocator.count();
    const fields: FormFieldInfo[] = [];

    for (let i = 0; i < count; i++) {
      const el = inputLocator.nth(i);
      const name =
        (await el.getAttribute('name')) ??
        (await el.getAttribute('id')) ??
        (await el.getAttribute('placeholder')) ??
        `field-${i}`;
      const type = (await el.getAttribute('type')) ??
        (await el.evaluate<string>((node) => node.tagName.toLowerCase()));
      const required =
        (await el.getAttribute('required')) !== null ||
        (await el.getAttribute('aria-required')) === 'true';

      fields.push({ name, type, required });
    }

    return fields;
  }

  async hasEmailField(): Promise<boolean> {
    const form = await this.findContactForm();
    if (!form) return false;
    const emailField = form.locator(
      'input[type="email"], input[name*="email" i], input[placeholder*="email" i]'
    );
    return (await emailField.count()) > 0;
  }

  async hasNameField(): Promise<boolean> {
    const form = await this.findContactForm();
    if (!form) return false;
    const nameField = form.locator(
      'input[name*="name" i], input[placeholder*="name" i], input[autocomplete*="name" i]'
    );
    return (await nameField.count()) > 0;
  }

  async hasSubmitButton(): Promise<boolean> {
    const form = await this.findContactForm();
    if (!form) return false;

    const submit = form.locator(
      'button[type="submit"], input[type="submit"], button:not([type="button"]):not([type="reset"])'
    ).filter({ hasText: /submit|send|contact|get in touch|reach out/i });

    if (await submit.count() > 0) return true;

    const anyButton = form.locator('button, input[type="submit"]');
    return (await anyButton.count()) > 0;
  }

  async fillForm(data: Record<string, string>): Promise<void> {
    const form = await this.findContactForm();
    if (!form) throw new Error('[ContactFormPage] No contact form found on this page.');

    for (const [key, value] of Object.entries(data)) {
      const field = form.locator(
        `input[name="${key}"], input[id="${key}"], input[placeholder*="${key}" i], ` +
        `textarea[name="${key}"], textarea[id="${key}"], textarea[placeholder*="${key}" i]`
      ).first();

      if (await field.count() > 0) {
        await field.fill(value);
      }
    }
  }

  async validateFormPresence(): Promise<boolean> {
    const form = await this.findContactForm();
    if (!form) return false;

    const hasSubmit = await this.hasSubmitButton();
    return hasSubmit;
  }

  async getSelectOptions(selectLocator: Locator): Promise<string[]> {
    return selectLocator.locator('option').evaluateAll(
      (opts) => opts.map((o) => (o as HTMLOptionElement).textContent?.trim() ?? '')
    );
  }
}
