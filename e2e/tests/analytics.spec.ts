import { test, expect } from '@playwright/test';
import { STORAGE_STATE_PATH } from '../helpers/auth';
import { cleanupByTitlePattern } from '../helpers/db';

test.use({ storageState: STORAGE_STATE_PATH });

const SEED = 'PW-Analytics';

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext({ storageState: STORAGE_STATE_PATH });
  const page = await context.newPage();
  await page.goto('/');
  await page.getByRole('link', { name: 'Add Job' }).first().click();
  await expect(page.getByRole('heading', { name: 'Add Job Application' })).toBeVisible();
  await page.getByPlaceholder('e.g. Senior Frontend Engineer').fill(`${SEED}-Seed`);
  await page.getByPlaceholder('e.g. Acme Corp').fill('Analytics Corp');
  await page.locator('select').first().selectOption('applied');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForURL('/');
  await context.close();
});

test.afterAll(async () => {
  cleanupByTitlePattern(SEED);
});

test('analytics page loads', async ({ page }) => {
  await page.goto('/analytics');
  await expect(page.getByRole('heading', { name: 'Analytics' })).toBeVisible();
  await expect(page.locator('a[href="/"]')).toBeVisible();
});

test('analytics charts render with data', async ({ page }) => {
  await page.goto('/analytics');
  await expect(page.getByText('Status Breakdown')).toBeVisible();
  await expect(page.locator('.recharts-wrapper').first()).toBeVisible();
});

test('analytics shows stat cards when data exists', async ({ page }) => {
  await page.goto('/analytics');

  await expect(page.getByText('Total Applications')).toBeVisible();
  await expect(page.getByText('Interview Rate')).toBeVisible();
  await expect(page.getByText('Offer Rate')).toBeVisible();
  await expect(page.getByText('Active')).toBeVisible();
});

test('navigate back to home from analytics', async ({ page }) => {
  await page.goto('/analytics');
  await expect(page.getByRole('heading', { name: 'Analytics' })).toBeVisible();

  // Click the back arrow button
  await page.locator('a[href="/"]').first().click();
  await expect(page).toHaveURL('/');
});
