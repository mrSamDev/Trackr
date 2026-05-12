import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const TEST_USER = {
  name: 'E2E Tester',
  email: 'e2e-test@example.com',
  password: 'playwright-pass-123',
};

export const STORAGE_STATE_PATH = path.join(__dirname, '../.auth/user.json');

const HOME_URL = /localhost:3000\/?$/;

function log(msg: string) {
  console.error(`[auth setup] ${msg}`);
}

/**
 * Logs in the test user and saves storageState.
 * Idempotent: tries login first, falls back to registration if user doesn't exist yet.
 */
export async function setupAuth(): Promise<void> {
  fs.mkdirSync(path.dirname(STORAGE_STATE_PATH), { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Try login first
  log('Navigating to login...');
  await page.goto('http://localhost:3000/login');
  await page.waitForSelector('input[id="email"]', { timeout: 10000 });
  log('Filling email and password...');
  await page.getByLabel('Email').fill(TEST_USER.email);
  await page.getByLabel('Password').fill(TEST_USER.password);

  log('Clicking Sign in...');
  await page.getByRole('button', { name: 'Sign in' }).click();

  try {
    await page.waitForURL(HOME_URL, { timeout: 15000 });
    log('Login succeeded!');
  } catch {
    log('Login failed, trying registration...');
    await page.goto('http://localhost:3000/register');
    await page.waitForSelector('input[id="name"]', { timeout: 10000 });
    log('Filling registration form...');
    await page.getByLabel('Name').fill(TEST_USER.name);
    await page.getByLabel('Email').fill(TEST_USER.email);
    await page.getByLabel('Password').fill(TEST_USER.password);

    log('Clicking Create account...');
    await page.getByRole('button', { name: 'Create account' }).click();

    try {
      await page.waitForURL(HOME_URL, { timeout: 15000 });
      log('Registration succeeded!');
    } catch {
      const errorText = await page
        .locator('text=/already exists/i')
        .textContent()
        .catch(() => null);

      if (errorText) {
        log('User already exists, logging in...');
        await page.goto('http://localhost:3000/login');
        await page.waitForSelector('input[id="email"]', { timeout: 10000 });
        await page.getByLabel('Email').fill(TEST_USER.email);
        await page.getByLabel('Password').fill(TEST_USER.password);
        await page.getByRole('button', { name: 'Sign in' }).click();
        await page.waitForURL(HOME_URL, { timeout: 15000 });
        log('Login succeeded after registration fallback!');
      } else {
        const anyError = await page
          .locator('p[class*="destructive"]')
          .textContent()
          .catch(() => null);
        throw new Error(`Auth failed: ${anyError ?? 'unknown error'} (URL: ${page.url()})`);
      }
    }
  }

  await context.storageState({ path: STORAGE_STATE_PATH });
  await browser.close();
}
