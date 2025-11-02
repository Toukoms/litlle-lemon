import { test, expect } from '@playwright/test';

test.describe('NotFound Page (404)', () => {
  test('should display 404 page for invalid route', async ({ page }) => {
    // Navigate to a non-existent route
    await page.goto('/this-page-does-not-exist');

    // Should display 404 page
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /page not found/i })).toBeVisible();
  });

  test('should display appropriate error message', async ({ page }) => {
    await page.goto('/invalid-route');

    await expect(page.getByText(/the page you're looking for doesn't exist/i)).toBeVisible();
  });

  test('should display search icon', async ({ page }) => {
    await page.goto('/non-existent-page');

    // Check for search icon (lucide-react Search icon)
    const icon = page.locator('svg').first();
    await expect(icon).toBeVisible();
  });

  test('should have Go to Home button', async ({ page }) => {
    await page.goto('/invalid-route');

    const homeButton = page.getByRole('button', { name: /go to home/i });
    await expect(homeButton).toBeVisible();
  });

  test('should have Go Back button', async ({ page }) => {
    await page.goto('/invalid-route');

    const backButton = page.getByRole('button', { name: /^go back$/i });
    await expect(backButton).toBeVisible();
  });

  test('should navigate to home when clicking Go to Home button', async ({ page }) => {
    await page.goto('/does-not-exist');

    // Click Go to Home button
    await page.getByRole('button', { name: /go to home/i }).click();

    // Should navigate to home page
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Little Lemon' })).toBeVisible();
  });

  test('should go back when clicking Go Back button', async ({ page }) => {
    // Start at home page
    await page.goto('/');

    // Navigate to invalid page
    await page.goto('/invalid-page');

    // Click Go Back
    await page.getByRole('button', { name: /^go back$/i }).click();

    // Should go back to home page
    await expect(page).toHaveURL('/');
  });

  test('should display yellow accent color for icon background', async ({ page }) => {
    await page.goto('/404');

    // Icon container should have yellow background
    const iconContainer = page.locator('.bg-yellow-100').first();
    await expect(iconContainer).toBeVisible();
  });

  test('should have proper layout and styling', async ({ page }) => {
    await page.goto('/test-404');

    // Should be centered and have proper spacing
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();

    // Check that content is in a card/container
    const container = page.locator('.bg-white.rounded-lg').first();
    await expect(container).toBeVisible();
  });

  test('should work for deeply nested invalid routes', async ({ page }) => {
    await page.goto('/very/deep/invalid/nested/route');

    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /page not found/i })).toBeVisible();
  });

  test('should work for routes with query parameters', async ({ page }) => {
    await page.goto('/invalid?param=value');

    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  });

  test('should work for routes with hashes', async ({ page }) => {
    await page.goto('/invalid#section');

    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/mobile-404-test');

    // Elements should still be visible and properly laid out
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
    await expect(page.getByRole('button', { name: /go to home/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^go back$/i })).toBeVisible();
  });

  test('should have Home icon on Go to Home button', async ({ page }) => {
    await page.goto('/test');

    const homeButton = page.getByRole('button', { name: /go to home/i });

    // Button should contain an SVG icon
    const icon = homeButton.locator('svg');
    await expect(icon).toBeVisible();
  });

  test('should maintain consistent branding with yellow primary button', async ({ page }) => {
    await page.goto('/404');

    // Primary button should have yellow background
    const homeButton = page.getByRole('button', { name: /go to home/i });
    await expect(homeButton).toHaveClass(/bg-yellow-400/);
  });

  test('should have proper button hierarchy', async ({ page }) => {
    await page.goto('/test-404');

    const homeButton = page.getByRole('button', { name: /go to home/i });
    const backButton = page.getByRole('button', { name: /^go back$/i });

    // Home button should be more prominent (yellow)
    await expect(homeButton).toHaveClass(/bg-yellow-400/);

    // Back button should be secondary (gray)
    await expect(backButton).toHaveClass(/bg-gray-200/);
  });

  test('should handle special characters in URL', async ({ page }) => {
    await page.goto('/test%20with%20spaces');

    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  });

  test('should not show within RootLayout wrapper', async ({ page }) => {
    await page.goto('/invalid-page');

    // 404 page should have its own full-page layout
    // Should not see the standard header/footer from RootLayout
    const searchIcon = page.locator('svg').first();
    await expect(searchIcon).toBeVisible();

    // The 404 content should be full-page centered
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  });

  test('should have accessible focus states', async ({ page }) => {
    await page.goto('/404');

    const homeButton = page.getByRole('button', { name: /go to home/i });

    // Focus on button
    await homeButton.focus();
    await expect(homeButton).toBeFocused();

    // Tab to next button
    await page.keyboard.press('Tab');
    const backButton = page.getByRole('button', { name: /^go back$/i });
    await expect(backButton).toBeFocused();
  });
});
