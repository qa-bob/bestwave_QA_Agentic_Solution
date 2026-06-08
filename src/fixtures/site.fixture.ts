import { test as base, expect } from '@playwright/test';
import { loadSiteConfig, type SiteConfig } from '@site-types/site-config.types';
import { HomePage } from '@pages/home.page';
import { NavigationPage } from '@pages/navigation.page';
import { ContactFormPage } from '@pages/contact.page';
import { ProductsPage } from '@pages/products.page';
import { AboutPage } from '@pages/about.page';
import { DisplayItXPage } from '@pages/displayitx.page';
import { SupportPage } from '@pages/support.page';
import { WhereToBuyPage } from '@pages/where-to-buy.page';
import { ClientsPage } from '@pages/clients.page';

export interface Fixtures {
  siteConfig: SiteConfig;
  homePage: HomePage;
  navigationPage: NavigationPage;
  contactPage: ContactFormPage;
  productsPage: ProductsPage;
  aboutPage: AboutPage;
  displayItXPage: DisplayItXPage;
  supportPage: SupportPage;
  whereToBuyPage: WhereToBuyPage;
  clientsPage: ClientsPage;
}

export const test = base.extend<Fixtures>({
  siteConfig: async ({}, use) => {
    const config = loadSiteConfig();
    await use(config);
  },

  homePage: async ({ page, siteConfig }, use) => {
    const homePage = new HomePage(page, siteConfig);
    await homePage.navigate();
    await use(homePage);
  },

  navigationPage: async ({ page, siteConfig }, use) => {
    const navigationPage = new NavigationPage(page, siteConfig);
    await use(navigationPage);
  },

  contactPage: async ({ page, siteConfig }, use) => {
    const contactPage = new ContactFormPage(page, siteConfig);
    await use(contactPage);
  },

  productsPage: async ({ page, siteConfig }, use) => {
    const productsPage = new ProductsPage(page, siteConfig);
    await use(productsPage);
  },

  aboutPage: async ({ page, siteConfig }, use) => {
    const aboutPage = new AboutPage(page, siteConfig);
    await use(aboutPage);
  },

  displayItXPage: async ({ page, siteConfig }, use) => {
    const displayItXPage = new DisplayItXPage(page, siteConfig);
    await use(displayItXPage);
  },

  supportPage: async ({ page, siteConfig }, use) => {
    const supportPage = new SupportPage(page, siteConfig);
    await use(supportPage);
  },

  whereToBuyPage: async ({ page, siteConfig }, use) => {
    const whereToBuyPage = new WhereToBuyPage(page, siteConfig);
    await use(whereToBuyPage);
  },

  clientsPage: async ({ page, siteConfig }, use) => {
    const clientsPage = new ClientsPage(page, siteConfig);
    await use(clientsPage);
  },
});

export { expect };
