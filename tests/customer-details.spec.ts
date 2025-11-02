import { test, expect } from '@playwright/test';

test.describe('CustomerDetailsPage', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate through reservation page first to get to customer details
    await page.goto('/reservations');

    // Fill reservation form
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateString = futureDate.toISOString().split('T')[0];

    await page.getByLabel(/choose date/i).fill(dateString);
    await page.getByLabel(/choose time/i).selectOption('19:00');
    await page.getByLabel(/number of diners/i).fill('4');
    await page.getByLabel(/seating options/i).selectOption('standard');
    await page.getByRole('button', { name: /continue/i }).click();

    // Wait for navigation
    await expect(page).toHaveURL('/reservations/customer-details');
  });

  test('should display the page title and description', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Little Lemon' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /customer details/i })).toBeVisible();
    await expect(page.getByText(/Please provide your contact information/i)).toBeVisible();
  });

  test('should display all form fields with required indicators', async ({ page }) => {
    // Check for first name field with asterisk
    await expect(page.getByLabel(/first name/i)).toBeVisible();
    await expect(page.getByText(/first name/i).locator('..').getByText('*')).toBeVisible();

    // Check for last name field with asterisk
    await expect(page.getByLabel(/last name/i)).toBeVisible();
    await expect(page.getByText(/last name/i).locator('..').getByText('*')).toBeVisible();

    // Check for email field with asterisk
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByText(/^email/i).locator('..').getByText('*')).toBeVisible();

    // Check for phone field with asterisk
    await expect(page.getByLabel(/phone number/i)).toBeVisible();
    await expect(page.getByText(/phone number/i).locator('..').getByText('*')).toBeVisible();

    // Check for submit button
    await expect(page.getByRole('button', { name: /confirm reservation/i })).toBeVisible();
  });

  test('should display required fields note', async ({ page }) => {
    await expect(page.getByText(/\* required fields/i)).toBeVisible();
  });

  test('should show validation errors when submitting empty form', async ({ page }) => {
    // Try to submit without filling anything
    await page.getByRole('button', { name: /confirm reservation/i }).click();

    // Check for error messages
    await expect(page.getByText(/first name is required/i)).toBeVisible();
    await expect(page.getByText(/last name is required/i)).toBeVisible();
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/phone number is required/i)).toBeVisible();
  });

  test('should show error for individual empty fields', async ({ page }) => {
    // Fill some fields but not all
    await page.getByLabel(/first name/i).fill('John');
    await page.getByLabel(/last name/i).fill('Doe');

    // Try to submit
    await page.getByRole('button', { name: /confirm reservation/i }).click();

    // Should still show errors for unfilled fields
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/phone number is required/i)).toBeVisible();

    // But not for filled fields
    await expect(page.getByText(/first name is required/i)).not.toBeVisible();
    await expect(page.getByText(/last name is required/i)).not.toBeVisible();
  });

  test('should clear error when user starts typing', async ({ page }) => {
    // Submit empty form to trigger errors
    await page.getByRole('button', { name: /confirm reservation/i }).click();
    await expect(page.getByText(/first name is required/i)).toBeVisible();

    // Start typing
    await page.getByLabel(/first name/i).fill('J');

    // Error should disappear
    await expect(page.getByText(/first name is required/i)).not.toBeVisible();
  });

  test('should accept valid customer information', async ({ page }) => {
    const firstName = page.getByLabel(/first name/i);
    const lastName = page.getByLabel(/last name/i);
    const email = page.getByLabel(/email/i);
    const phone = page.getByLabel(/phone number/i);

    await firstName.fill('John');
    await expect(firstName).toHaveValue('John');

    await lastName.fill('Doe');
    await expect(lastName).toHaveValue('Doe');

    await email.fill('john.doe@example.com');
    await expect(email).toHaveValue('john.doe@example.com');

    await phone.fill('1234567890');
    await expect(phone).toHaveValue('1234567890');
  });

  test('should validate email format', async ({ page }) => {
    const email = page.getByLabel(/email/i);

    // Email input should have type="email"
    await expect(email).toHaveAttribute('type', 'email');
  });

  test('should validate phone format', async ({ page }) => {
    const phone = page.getByLabel(/phone number/i);

    // Phone input should have type="tel"
    await expect(phone).toHaveAttribute('type', 'tel');
  });

  test('should show placeholder for phone number', async ({ page }) => {
    const phone = page.getByLabel(/phone number/i);
    await expect(phone).toHaveAttribute('placeholder', '(123) 456-7890');
  });

  test('should navigate to payment page when form is valid', async ({ page }) => {
    // Fill all fields with valid data
    await page.getByLabel(/first name/i).fill('John');
    await page.getByLabel(/last name/i).fill('Doe');
    await page.getByLabel(/email/i).fill('john.doe@example.com');
    await page.getByLabel(/phone number/i).fill('1234567890');

    // Submit the form
    await page.getByRole('button', { name: /confirm reservation/i }).click();

    // Should navigate to payment page
    await expect(page).toHaveURL('/reservations/payment');
  });

  test('should show error borders on invalid fields', async ({ page }) => {
    // Submit empty form to trigger errors
    await page.getByRole('button', { name: /confirm reservation/i }).click();

    // Check that inputs have error styling (red border)
    const firstName = page.getByLabel(/first name/i);
    await expect(firstName).toHaveClass(/border-red-500/);
  });

  test('should handle special characters in name fields', async ({ page }) => {
    const firstName = page.getByLabel(/first name/i);
    const lastName = page.getByLabel(/last name/i);

    // Test names with hyphens, apostrophes
    await firstName.fill("Mary-Jane");
    await lastName.fill("O'Brien");

    await expect(firstName).toHaveValue("Mary-Jane");
    await expect(lastName).toHaveValue("O'Brien");
  });

  test('should handle international email addresses', async ({ page }) => {
    const email = page.getByLabel(/email/i);

    // Test various valid email formats
    await email.fill('user+tag@example.co.uk');
    await expect(email).toHaveValue('user+tag@example.co.uk');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Check elements are still visible and usable
    await expect(page.getByRole('heading', { name: /customer details/i })).toBeVisible();
    await expect(page.getByLabel(/first name/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /confirm reservation/i })).toBeVisible();
  });

  test('should maintain focus management', async ({ page }) => {
    const firstName = page.getByLabel(/first name/i);

    // Focus should work properly
    await firstName.focus();
    await expect(firstName).toBeFocused();

    // Tab should move to next field
    await page.keyboard.press('Tab');
    const lastName = page.getByLabel(/last name/i);
    await expect(lastName).toBeFocused();
  });

  test('should not allow form submission with whitespace-only values', async ({ page }) => {
    // Fill fields with only whitespace
    await page.getByLabel(/first name/i).fill('   ');
    await page.getByLabel(/last name/i).fill('   ');
    await page.getByLabel(/email/i).fill('   ');
    await page.getByLabel(/phone number/i).fill('   ');

    // Try to submit
    await page.getByRole('button', { name: /confirm reservation/i }).click();

    // Should show validation errors
    await expect(page.getByText(/first name is required/i)).toBeVisible();

    // Should not navigate away
    await expect(page).toHaveURL('/reservations/customer-details');
  });
});
