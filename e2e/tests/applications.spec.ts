import { test, expect } from '@playwright/test';
import { STORAGE_STATE_PATH } from '../helpers/auth';
import { cleanupByTitlePattern } from '../helpers/db';

test.use({ storageState: STORAGE_STATE_PATH });

const SEED = 'PW';

function uniqueTitle(label: string) {
  return `${SEED}-${label}-${Date.now()}`;
}

test.afterEach(async () => {
  cleanupByTitlePattern(SEED);
});

async function createApp(
  page: import('@playwright/test').Page,
  title: string,
  status: 'applied' | 'interview' | 'recruiter_call' | 'offer' | 'rejected' = 'applied',
) {
  const currentUrl = page.url();
  if (currentUrl.match(/localhost:3000\/?$/)) {
    await page.getByRole('link', { name: 'Add Job' }).click();
  } else {
    await page.goto('/');
    await page.getByRole('link', { name: 'Add Job' }).click();
  }
  await expect(page.getByRole('heading', { name: 'Add Job Application' })).toBeVisible();
  await page.getByPlaceholder('e.g. Senior Frontend Engineer').fill(title);
  await page.getByPlaceholder('e.g. Acme Corp').fill('Playwright Corp');
  await page.locator('select').selectOption(status);
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForURL('/');
}

test('create a new application', async ({ page }) => {
  const title = uniqueTitle('Create');
  await page.goto('/new');

  await expect(page.getByRole('heading', { name: 'Add Job Application' })).toBeVisible();

  await page.getByPlaceholder('e.g. Senior Frontend Engineer').fill(title);
  await page.getByPlaceholder('e.g. Acme Corp').fill('Playwright Corp');
  await page.locator('select').selectOption('applied');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByRole('cell', { name: title })).toBeVisible();
});

test('form validation requires title and company', async ({ page }) => {
  await page.goto('/new');

  await expect(page.getByRole('heading', { name: 'Add Job Application' })).toBeVisible();

  // Try to submit empty form
  await page.getByRole('button', { name: 'Save' }).click();

  // Should show validation errors
  await expect(page.getByText('Title is required')).toBeVisible();
  await expect(page.getByText('Company is required')).toBeVisible();

  // Fill in only company, still should show title error
  await page.getByPlaceholder('e.g. Acme Corp').fill('Some Company');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Title is required')).toBeVisible();

  // Fill in title, errors should be gone
  await page.getByPlaceholder('e.g. Senior Frontend Engineer').fill('Some Title');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByRole('cell', { name: 'Some Title' })).toBeVisible();
});

test('created application appears in the list', async ({ page }) => {
  const title = uniqueTitle('List');
  await createApp(page, title);

  await page.goto('/');
  await expect(page.getByRole('cell', { name: title })).toBeVisible();
});

test('search filters applications by title', async ({ page }) => {
  const title = uniqueTitle('Search');
  const otherTitle = uniqueTitle('Other');
  await createApp(page, title);
  await createApp(page, otherTitle);

  await page.goto('/');
  await page.getByPlaceholder('Search title or company...').fill(title);
  await page.waitForTimeout(400);

  await expect(page.getByRole('cell', { name: title })).toBeVisible();
  await expect(page.getByRole('cell', { name: otherTitle })).not.toBeVisible();
});

test('filter by status shows only matching applications', async ({ page }) => {
  const appliedTitle = uniqueTitle('Applied');
  const interviewTitle = uniqueTitle('Interview');
  await createApp(page, appliedTitle, 'applied');
  await createApp(page, interviewTitle, 'interview');

  await page.goto('/');
  await page.getByRole('button', { name: 'Interview' }).click();
  await page.waitForTimeout(400);

  await expect(page.getByRole('cell', { name: interviewTitle })).toBeVisible();
  await expect(page.getByRole('cell', { name: appliedTitle })).not.toBeVisible();
});

test('edit an application', async ({ page }) => {
  const title = uniqueTitle('Edit');
  const updatedTitle = uniqueTitle('Edited');
  await createApp(page, title);

  await page.goto('/');
  const row = page.getByRole('row').filter({ hasText: title });
  await row.getByRole('link', { name: 'Edit' }).click();

  await expect(page.getByRole('heading', { name: 'Edit Application' })).toBeVisible();

  const titleInput = page.getByPlaceholder('e.g. Senior Frontend Engineer');
  await titleInput.clear();
  await titleInput.fill(updatedTitle);
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByRole('cell', { name: updatedTitle })).toBeVisible();
  await expect(page.getByRole('cell', { name: title })).not.toBeVisible();
});

test('delete an application', async ({ page }) => {
  const title = uniqueTitle('Delete');
  await createApp(page, title);

  await page.goto('/');
  const row = page.getByRole('row').filter({ hasText: title });
  await row.getByRole('link', { name: 'Edit' }).click();

  await expect(page.getByRole('heading', { name: 'Edit Application' })).toBeVisible();

  page.on('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Delete' }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByRole('cell', { name: title })).not.toBeVisible();
});

test('form validates on edit', async ({ page }) => {
  const title = uniqueTitle('EditValidation');
  await createApp(page, title);

  await page.goto('/');
  const row = page.getByRole('row').filter({ hasText: title });
  await row.getByRole('link', { name: 'Edit' }).click();

  await expect(page.getByRole('heading', { name: 'Edit Application' })).toBeVisible();

  // Clear required fields to trigger validation
  await page.getByPlaceholder('e.g. Senior Frontend Engineer').clear();
  await page.getByPlaceholder('e.g. Acme Corp').clear();
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByText('Title is required')).toBeVisible();
  await expect(page.getByText('Company is required')).toBeVisible();

  // Refill and save
  await page.getByPlaceholder('e.g. Senior Frontend Engineer').fill(title);
  await page.getByPlaceholder('e.g. Acme Corp').fill('Test Company');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page).toHaveURL('/');
});

test('status dropdown has all options', async ({ page }) => {
  await page.goto('/new');

  const statusSelect = page.locator('select').first();
  const options = await statusSelect.locator('option').allTextContents();

  expect(options).toContain('Applied');
  expect(options).toContain('Interview');
  expect(options).toContain('Recruiter Call');
  expect(options).toContain('Offer');
  expect(options).toContain('Rejected');
});

test('all status filters work', async ({ page }) => {
  const appliedTitle = uniqueTitle('FilterApplied');
  const interviewTitle = uniqueTitle('FilterInterview');
  const offerTitle = uniqueTitle('FilterOffer');
  const rejectedTitle = uniqueTitle('FilterRejected');
  const recruiterTitle = uniqueTitle('FilterRecruiter');

  await createApp(page, appliedTitle, 'applied');
  await createApp(page, interviewTitle, 'interview');
  await createApp(page, offerTitle, 'offer');
  await createApp(page, rejectedTitle, 'rejected');
  await createApp(page, recruiterTitle, 'recruiter_call');

  await page.goto('/');

  for (const [statusName, title] of [
    ['Applied', appliedTitle],
    ['Interview', interviewTitle],
    ['Offer', offerTitle],
    ['Rejected', rejectedTitle],
    ['Recruiter Call', recruiterTitle],
  ] as const) {
    await page.getByRole('button', { name: statusName }).click();
    await page.waitForTimeout(400);
    await expect(page.getByRole('cell', { name: title })).toBeVisible();
    await page.getByRole('button', { name: 'All' }).click();
  }
});
