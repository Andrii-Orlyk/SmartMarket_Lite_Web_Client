import { expect, test } from '@playwright/test';

const liveApiEnabled = process.env.SMARTMARKET_LIVE_API === '1';

test.describe('Live auth smoke (local/manual only)', () => {
  test.skip(!liveApiEnabled, 'Set SMARTMARKET_LIVE_API=1 with backend running to enable live auth smoke.');

  test('login page can submit to live backend', async ({ page }) => {
    const email = process.env.SMARTMARKET_TEST_EMAIL;
    const password = process.env.SMARTMARKET_TEST_PASSWORD;

    test.skip(!email || !password, 'Set SMARTMARKET_TEST_EMAIL and SMARTMARKET_TEST_PASSWORD for live auth smoke.');

    await page.goto('/login');
    await page.getByLabel('Email').fill(email!);
    await page.getByLabel('Password').fill(password!);
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/products/);
  });
});
