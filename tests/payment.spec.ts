import { test, expect } from '@playwright/test';

test.describe('PaymentPage', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate through the full flow to get to payment page
    await page.goto('/reservations');

    // Fill reservation form
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateString = futureDate.toISOString().split('T')[0];

    await page.getByLabel(/choose date/i).fill(dateString);
    await page.getByLabel(/choose time/i).selectOption('19:00');
    await page.getByLabel(/number of diners/i).fill('4');
    await page.getByLabel(/seating options/i).selectOption('outside');
    await page.getByRole('button', { name: /continue/i }).click();

    // Fill customer details
    await page.getByLabel(/first name/i).fill('John');
    await page.getByLabel(/last name/i).fill('Doe');
    await page.getByLabel(/email/i).fill('john.doe@example.com');
    await page.getByLabel(/phone number/i).fill('1234567890');
    await page.getByRole('button', { name: /confirm reservation/i }).click();

    // Wait for navigation to payment page
    await expect(page).toHaveURL('/reservations/payment');
  });

  test('should display the page title and description', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Little Lemon' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /payment details/i })).toBeVisible();
    await expect(page.getByText(/Secure your reservation with a credit card/i)).toBeVisible();
  });

  test('should display all form fields with required indicators', async ({ page }) => {
    // Card number
    await expect(page.getByLabel(/credit card number/i)).toBeVisible();
    await expect(page.getByText(/credit card number/i).locator('..').getByText('*')).toBeVisible();

    // Cardholder first name
    await expect(page.getByLabel(/first name/i)).toBeVisible();

    // Cardholder last name
    await expect(page.getByLabel(/last name/i)).toBeVisible();

    // Expiration date
    await expect(page.getByLabel(/expiration date/i)).toBeVisible();

    // CVV
    await expect(page.getByLabel(/cvv/i)).toBeVisible();

    // Submit button
    await expect(page.getByRole('button', { name: /confirm and secure reservation/i })).toBeVisible();
  });

  test('should pre-fill cardholder name from customer details', async ({ page }) => {
    // Cardholder name should be pre-filled with customer data
    const firstName = page.getByLabel(/first name/i);
    const lastName = page.getByLabel(/last name/i);

    await expect(firstName).toHaveValue('John');
    await expect(lastName).toHaveValue('Doe');
  });

  test('should display CVV information section', async ({ page }) => {
    await expect(page.getByText(/where is my cvv/i)).toBeVisible();
  });

  test('should toggle CVV information when clicked', async ({ page }) => {
    const cvvButton = page.getByRole('button', { name: /where is my cvv/i });

    // Initially, detailed info should not be visible
    await expect(page.getByText(/Card Verification Value/i)).not.toBeVisible();

    // Click to expand
    await cvvButton.click();

    // Now detailed info should be visible
    await expect(page.getByText(/Card Verification Value/i)).toBeVisible();
    await expect(page.getByText(/Visa, Mastercard, Discover/i)).toBeVisible();
    await expect(page.getByText(/American Express/i)).toBeVisible();

    // Click again to collapse
    await cvvButton.click();

    // Info should be hidden again
    await expect(page.getByText(/Card Verification Value/i)).not.toBeVisible();
  });

  test('should format card number with spaces', async ({ page }) => {
    const cardNumber = page.getByLabel(/credit card number/i);

    // Type card number without spaces
    await cardNumber.fill('4532123456789012');

    // Should be formatted with spaces
    await expect(cardNumber).toHaveValue('4532 1234 5678 9012');
  });

  test('should format expiration date as MM/YY', async ({ page }) => {
    const expirationDate = page.getByLabel(/expiration date/i);

    // Type digits
    await expirationDate.fill('1225');

    // Should be formatted as MM/YY
    await expect(expirationDate).toHaveValue('12/25');
  });

  test('should limit card number to 19 characters (16 digits + 3 spaces)', async ({ page }) => {
    const cardNumber = page.getByLabel(/credit card number/i);

    // Try to enter more than 16 digits
    await cardNumber.fill('12345678901234567890');

    // Should be limited to 16 digits with proper spacing
    const value = await cardNumber.inputValue();
    const digitsOnly = value.replace(/\s/g, '');
    expect(digitsOnly.length).toBeLessThanOrEqual(16);
  });

  test('should limit CVV to 4 digits', async ({ page }) => {
    const cvv = page.getByLabel(/cvv/i);

    // Try to enter more than 4 digits
    await cvv.fill('12345');

    // Should be limited to 4 digits
    const value = await cvv.inputValue();
    expect(value.length).toBeLessThanOrEqual(4);
  });

  test('should only accept digits in card number', async ({ page }) => {
    const cardNumber = page.getByLabel(/credit card number/i);

    // Try to enter letters
    await cardNumber.fill('abcd1234');

    // Should only contain digits and spaces
    const value = await cardNumber.inputValue();
    expect(value).toMatch(/^[\d\s]*$/);
  });

  test('should only accept digits in CVV', async ({ page }) => {
    const cvv = page.getByLabel(/cvv/i);

    // Try to enter letters
    await cvv.fill('abc123');

    // Should only contain digits
    const value = await cvv.inputValue();
    expect(value).toMatch(/^\d*$/);
  });

  test('should show validation errors when submitting empty form', async ({ page }) => {
    // Clear pre-filled fields
    await page.getByLabel(/first name/i).clear();
    await page.getByLabel(/last name/i).clear();

    // Try to submit
    await page.getByRole('button', { name: /confirm and secure reservation/i }).click();

    // Check for error messages
    await expect(page.getByText(/please enter a valid card number/i)).toBeVisible();
    await expect(page.getByText(/required/i).first()).toBeVisible();
  });

  test('should validate card number length', async ({ page }) => {
    const cardNumber = page.getByLabel(/credit card number/i);

    // Fill other required fields
    await page.getByLabel(/expiration date/i).fill('1225');
    await page.getByLabel(/cvv/i).fill('123');

    // Enter too short card number
    await cardNumber.fill('1234');

    // Try to submit
    await page.getByRole('button', { name: /confirm and secure reservation/i }).click();

    // Should show error
    await expect(page.getByText(/please enter a valid card number/i)).toBeVisible();

    // Should not navigate away
    await expect(page).toHaveURL('/reservations/payment');
  });

  test('should validate expiration date format', async ({ page }) => {
    const expirationDate = page.getByLabel(/expiration date/i);

    // Fill other fields
    await page.getByLabel(/credit card number/i).fill('4532123456789012');
    await page.getByLabel(/cvv/i).fill('123');

    // Enter incomplete expiration
    await expirationDate.fill('12');

    // Try to submit
    await page.getByRole('button', { name: /confirm and secure reservation/i }).click();

    // Should show error
    await expect(page.getByText(/required/i).first()).toBeVisible();
  });

  test('should validate CVV length', async ({ page }) => {
    const cvv = page.getByLabel(/cvv/i);

    // Fill other fields
    await page.getByLabel(/credit card number/i).fill('4532123456789012');
    await page.getByLabel(/expiration date/i).fill('1225');

    // Enter too short CVV
    await cvv.fill('12');

    // Try to submit
    await page.getByRole('button', { name: /confirm and secure reservation/i }).click();

    // Should show error
    await expect(page.getByText(/required/i).first()).toBeVisible();
  });

  test('should show confirmation popup on successful submission', async ({ page }) => {
    // Fill all required fields
    await page.getByLabel(/credit card number/i).fill('4532123456789012');
    await page.getByLabel(/expiration date/i).fill('1225');
    await page.getByLabel(/cvv/i).fill('123');

    // Submit the form
    await page.getByRole('button', { name: /confirm and secure reservation/i }).click();

    // Wait for popup to appear
    await expect(page.getByRole('heading', { name: /your place is reserved/i })).toBeVisible();
  });

  test('should display reservation details in confirmation popup', async ({ page }) => {
    // Fill and submit form
    await page.getByLabel(/credit card number/i).fill('4532123456789012');
    await page.getByLabel(/expiration date/i).fill('1225');
    await page.getByLabel(/cvv/i).fill('123');
    await page.getByRole('button', { name: /confirm and secure reservation/i }).click();

    // Check confirmation popup contains reservation details
    await expect(page.getByText(/john doe/i)).toBeVisible();
    await expect(page.getByText(/john\.doe@example\.com/i)).toBeVisible();
    await expect(page.getByText(/1234567890/i)).toBeVisible();
    await expect(page.getByText(/19:00/)).toBeVisible();
    await expect(page.getByText(/guests:\s*4/i)).toBeVisible();
    await expect(page.getByText(/outside/i)).toBeVisible();
  });

  test('should return to home when clicking Return to Home button', async ({ page }) => {
    // Fill and submit form
    await page.getByLabel(/credit card number/i).fill('4532123456789012');
    await page.getByLabel(/expiration date/i).fill('1225');
    await page.getByLabel(/cvv/i).fill('123');
    await page.getByRole('button', { name: /confirm and secure reservation/i }).click();

    // Wait for popup
    await expect(page.getByRole('heading', { name: /your place is reserved/i })).toBeVisible();

    // Click Return to Home
    await page.getByRole('button', { name: /return to home/i }).click();

    // Should navigate to home page
    await expect(page).toHaveURL('/');
  });

  test('should display credit card icon', async ({ page }) => {
    // Credit card icon should be visible in the card number field
    const cardNumberField = page.getByLabel(/credit card number/i).locator('..');
    const icon = cardNumberField.locator('svg');
    await expect(icon).toBeVisible();
  });

  test('should have placeholder texts', async ({ page }) => {
    await expect(page.getByLabel(/credit card number/i)).toHaveAttribute('placeholder', '1234 5678 9012 3456');
    await expect(page.getByLabel(/expiration date/i)).toHaveAttribute('placeholder', 'MM/YY');
    await expect(page.getByLabel(/cvv/i)).toHaveAttribute('placeholder', '123');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Check elements are still visible and usable
    await expect(page.getByRole('heading', { name: /payment details/i })).toBeVisible();
    await expect(page.getByLabel(/credit card number/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /confirm and secure reservation/i })).toBeVisible();
  });

  test('should clear errors when user starts typing', async ({ page }) => {
    // Submit empty form (after clearing pre-filled data)
    await page.getByLabel(/first name/i).clear();
    await page.getByRole('button', { name: /confirm and secure reservation/i }).click();

    // Should show error
    await expect(page.getByText(/required/i).first()).toBeVisible();

    // Start typing in first name
    await page.getByLabel(/first name/i).fill('J');

    // Error should disappear
    const errors = page.getByText(/required/i);
    const count = await errors.count();
    expect(count).toBeLessThan(5); // Should have fewer errors now
  });

  test('should show green checkmark icon in confirmation popup', async ({ page }) => {
    // Fill and submit form
    await page.getByLabel(/credit card number/i).fill('4532123456789012');
    await page.getByLabel(/expiration date/i).fill('1225');
    await page.getByLabel(/cvv/i).fill('123');
    await page.getByRole('button', { name: /confirm and secure reservation/i }).click();

    // Check for checkmark SVG in popup
    await expect(page.getByRole('heading', { name: /your place is reserved/i })).toBeVisible();
    const popup = page.locator('.fixed');
    const checkmark = popup.locator('svg path');
    await expect(checkmark).toBeVisible();
  });
});
