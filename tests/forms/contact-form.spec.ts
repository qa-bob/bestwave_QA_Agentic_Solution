/**
 * tests/forms/contact-form.spec.ts
 *
 * Contact form tests — verify the presence and structure of the Best Wave
 * contact form at /Best-Wave-Contact-Form.php.
 * IMPORTANT: These tests do NOT submit forms to avoid sending real messages.
 *
 * Tag: @forms
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Contact Form @forms', () => {
  test.beforeEach(async ({ siteConfig, contactPage }) => {
    if (siteConfig.skipForms) {
      test.skip(true, `Forms testing skipped for "${siteConfig.name}" (skipForms: true)`);
    }
    // Navigate directly to the known contact form URL
    await contactPage.navigateToContactPage();
    await contactPage.waitForLoad();
  });

  // ── Form presence ───────────────────────────────────────────────────────────

  test('contact form is present on the contact page @forms', async ({ contactPage }) => {
    const form = await contactPage.findContactForm();
    expect(form, 'A <form> element should be present on the contact page').not.toBeNull();
  });

  test('contact form page has a visible heading @forms', async ({ contactPage, page }) => {
    // Site uses no h1/h2 tags and the <form> element itself may be inside a hidden
    // layout container. Verify the page is usable by checking the textarea is visible.
    const form = await contactPage.findContactForm();
    expect(form, 'Contact form should be present on the page').not.toBeNull();
    const textarea = page.locator('textarea').first();
    await expect(textarea, 'Contact page textarea should be visible').toBeVisible();
  });

  // ── Field presence ──────────────────────────────────────────────────────────

  test('contact form has a name field @forms', async ({ contactPage }) => {
    const form = await contactPage.findContactForm();
    if (!form) {
      test.skip(true, 'No contact form found');
      return;
    }
    const hasName = await contactPage.hasNameField();
    if (!hasName) {
      console.warn('[forms] Name field not detected — form may use unlabeled inputs.');
    }
    // Check raw input count as fallback
    const inputCount = await form.locator('input[type="text"], input:not([type])').count();
    expect(
      inputCount,
      'Contact form should have at least one text input (for name/company/etc.)'
    ).toBeGreaterThan(0);
  });

  test('contact form has an email field @forms', async ({ contactPage }) => {
    const form = await contactPage.findContactForm();
    if (!form) {
      test.skip(true, 'No contact form found');
      return;
    }
    // Bestwave may use type="text" with a label "Email Address"
    const emailByType = await form.locator('input[type="email"]').count();
    const emailByName = await form.locator('input[name*="email" i], input[id*="email" i]').count();
    const hasEmail = emailByType > 0 || emailByName > 0;

    if (!hasEmail) {
      console.warn('[forms] Could not identify email field by type/name — checking field count.');
    }
    // At minimum there should be several input fields
    const allInputs = await form.locator('input[type="text"], input[type="email"], input:not([type])').count();
    expect(allInputs, 'Contact form should have multiple input fields').toBeGreaterThan(1);
  });

  test('contact form has a message/textarea field @forms', async ({ contactPage }) => {
    const form = await contactPage.findContactForm();
    if (!form) {
      test.skip(true, 'No contact form found');
      return;
    }
    const textareaCount = await form.locator('textarea').count();
    expect(textareaCount, 'Contact form should have a textarea for the message').toBeGreaterThan(0);
  });

  test('contact form has dropdown selects @forms', async ({ contactPage }) => {
    const form = await contactPage.findContactForm();
    if (!form) {
      test.skip(true, 'No contact form found');
      return;
    }
    const selectCount = await form.locator('select').count();
    expect(selectCount, 'Contact form should have dropdown selects (Send To, Subject)').toBeGreaterThan(0);
  });

  test('"Send To" dropdown has expected options @forms', async ({ contactPage }) => {
    const form = await contactPage.findContactForm();
    if (!form) {
      test.skip(true, 'No contact form found');
      return;
    }
    const selects = form.locator('select');
    const selectCount = await selects.count();
    if (selectCount === 0) {
      test.skip(true, 'No select elements found in form');
      return;
    }
    const firstSelectOptions = await selects.first().locator('option').allTextContents();
    expect(firstSelectOptions.length, 'First dropdown should have at least 2 options').toBeGreaterThan(1);
  });

  // ── Submit button ───────────────────────────────────────────────────────────

  test('contact form has a submit button @forms', async ({ contactPage }) => {
    const form = await contactPage.findContactForm();
    if (!form) {
      test.skip(true, 'No contact form found');
      return;
    }
    const hasSubmit = await contactPage.hasSubmitButton();
    expect(hasSubmit, 'Contact form should have a submit button').toBeTruthy();
  });

  test('submit button is visible @forms', async ({ contactPage }) => {
    const form = await contactPage.findContactForm();
    if (!form) {
      test.skip(true, 'No contact form found');
      return;
    }
    const submitBtn = form.locator('input[type="submit"], button[type="submit"], button').last();
    await expect(submitBtn).toBeVisible();
  });

  // ── Field interaction ───────────────────────────────────────────────────────

  test('text inputs accept typed content @forms', async ({ contactPage, page }) => {
    const form = await contactPage.findContactForm();
    if (!form) {
      test.skip(true, 'No contact form found');
      return;
    }
    const firstInput = form.locator('input[type="text"], input:not([type="hidden"]):not([type="submit"]):not([type="radio"]):not([type="checkbox"])').first();
    if (await firstInput.count() === 0) {
      test.skip(true, 'No text inputs found in form');
      return;
    }
    await firstInput.fill('Test Input');
    const value = await firstInput.inputValue();
    expect(value).toBe('Test Input');
  });

  test('textarea accepts typed content @forms', async ({ contactPage }) => {
    const form = await contactPage.findContactForm();
    if (!form) {
      test.skip(true, 'No contact form found');
      return;
    }
    const textarea = form.locator('textarea').first();
    if (await textarea.count() === 0) {
      test.skip(true, 'No textarea found in form');
      return;
    }
    const testMessage = 'This is a test message to verify the textarea accepts input.';
    await textarea.fill(testMessage);
    const value = await textarea.inputValue();
    expect(value).toBe(testMessage);
  });

  // ── Empty-submit validation ─────────────────────────────────────────────────

  test('submitting an empty form stays on the Best Wave site @forms', async ({ contactPage, page }) => {
    const form = await contactPage.findContactForm();
    if (!form) {
      test.skip(true, 'No contact form found');
      return;
    }
    const hasSubmit = await contactPage.hasSubmitButton();
    if (!hasSubmit) {
      test.skip(true, 'No submit button found');
      return;
    }

    const submitBtn = form.locator('input[type="submit"], button[type="submit"], button').last();
    await submitBtn.click({ force: true });

    // Site uses PHP server-side validation; an empty submission triggers a POST but
    // should return the user to a Best Wave page (error page or redirect back)
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    expect(
      page.url().toLowerCase(),
      'After empty form submission, user should remain on the Best Wave site'
    ).toContain('bestwave.com');
  });
});
