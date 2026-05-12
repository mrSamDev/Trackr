import { test, expect } from '@playwright/test';
import { STORAGE_STATE_PATH } from '../helpers/auth';

test.use({ storageState: STORAGE_STATE_PATH });

const locationCheckbox = (page: import('@playwright/test').Page) =>
  page.locator('label').filter({ hasText: 'location' }).locator('input[type="checkbox"]');

const salaryCheckbox = (page: import('@playwright/test').Page) =>
  page.locator('label').filter({ hasText: 'salary' }).locator('input[type="checkbox"]');

test('settings page loads', async ({ page }) => {
  await page.goto('/settings');
  await expect(page.getByRole('heading', { name: 'Customize Fields' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Core Fields (always on)' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Optional Fields' })).toBeVisible();
});

test('core fields are always disabled and checked', async ({ page }) => {
  await page.goto('/settings');

  const coreFields = ['title', 'company', 'status', 'applied at'];
  for (const field of coreFields) {
    const checkbox = page.locator('label').filter({ hasText: field }).locator('input[type="checkbox"]');
    await expect(checkbox).toBeChecked();
    await expect(checkbox).toBeDisabled();
  }
});

test('toggle column visibility and save', async ({ page }) => {
  await page.goto('/settings');
  await expect(page.getByRole('heading', { name: 'Customize Fields' })).toBeVisible();

  const checkbox = locationCheckbox(page);
  const wasChecked = await checkbox.isChecked();

  await checkbox.click();
  await expect(checkbox).toBeChecked({ checked: !wasChecked });

  await page.getByRole('button', { name: 'Save Settings' }).click();
  await expect(page).toHaveURL('/');

  // Navigate back and verify the state persisted
  await page.goto('/settings');
  await expect(locationCheckbox(page)).toBeChecked({ checked: !wasChecked });

  // Restore original state
  await locationCheckbox(page).click();
  await page.getByRole('button', { name: 'Save Settings' }).click();
  await expect(page).toHaveURL('/');
});

test('toggle multiple optional fields', async ({ page }) => {
  await page.goto('/settings');

  const locCheck = locationCheckbox(page);
  const salCheck = salaryCheckbox(page);

  // Toggle both off
  if (await locCheck.isChecked()) await locCheck.click();
  if (await salCheck.isChecked()) await salCheck.click();

  await expect(locCheck).not.toBeChecked();
  await expect(salCheck).not.toBeChecked();

  // Save
  await page.getByRole('button', { name: 'Save Settings' }).click();
  await expect(page).toHaveURL('/');

  // Verify persistence
  await page.goto('/settings');
  await expect(locationCheckbox(page)).not.toBeChecked();
  await expect(salaryCheckbox(page)).not.toBeChecked();

  // Restore
  await locCheck.click();
  await salCheck.click();
  await page.getByRole('button', { name: 'Save Settings' }).click();
});

test('back button navigates to home', async ({ page }) => {
  await page.goto('/settings');
  await page.locator('button.rounded-full').first().click();
  await expect(page).toHaveURL('/');
});
