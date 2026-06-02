import { expect, test } from '@playwright/test';

test.describe('App smoke (no live backend required)', () => {
  test('app opens root route', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Portfolio frontend')).toBeVisible();
  });

  test('navigation shell renders', async ({ page }) => {
    await page.goto('/products');
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  });

  test('login page opens', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('register page opens', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();
  });

  test('unknown route shows not found page', async ({ page }) => {
    await page.goto('/does-not-exist');
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  });
});
