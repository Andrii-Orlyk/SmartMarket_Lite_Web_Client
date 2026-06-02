import { expect, test } from '@playwright/test';

test.describe('SmartMarket smoke', () => {
  test('home page renders portfolio intro', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Portfolio frontend')).toBeVisible();
    await expect(page.getByRole('link', { name: /skip to main content/i })).toBeAttached();
  });

  test('products route renders catalog shell', async ({ page }) => {
    await page.goto('/products');
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  });

  test('login page renders sign-in form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('unknown route shows not found recovery actions', async ({ page }) => {
    await page.goto('/does-not-exist');
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Browse products' })).toBeVisible();
  });
});
