import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const TEST_USER = {
  name: 'E2E Tester',
  email: 'e2e-test@playwright.local',
  password: 'playwright-pass-123',
};

export const STORAGE_STATE_PATH = path.join(__dirname, '../.auth/user.json');

const HOME_URL = /localhost:3000\/?$/;

/**
 * Logs in the test user and saves storageState.
 * Idempotent: tries login first, falls back to registration if user doesn't exist yet.
 */
export async function setupAuth(): Promise<void> {
  fs.mkdirSync(path.dirname(STORAGE_STATE_PATH), { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Try login first — works on every run after the first
  await page.goto('http://localhost:3000/login');
  await page.getByLabel('Email').fill(TEST_USER.email);
  await page.getByLabel('Password').fill(TEST_USER.password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  const loginSucceeded = await page
    .waitForURL(HOME_URL, { timeout: 8_000 })
    .then(() => true)
    .catch(() => false);

  if (!loginSucceeded) {
    // First run — user doesn't exist yet, register
    await page.goto('http://localhost:3000/register');
    await page.getByLabel('Name').fill(TEST_USER.name);
    await page.getByLabel('Email').fill(TEST_USER.email);
    await page.getByLabel('Password').fill(TEST_USER.password);
    await page.getByRole('button', { name: 'Create account' }).click();
    await page.waitForURL(HOME_URL, { timeout: 15_000 });
  }

  await context.storageState({ path: STORAGE_STATE_PATH });
  await browser.close();
}
