import { expect, test } from "@playwright/test";

test.describe("End-to-End Reservation Flow", () => {
  test("should complete full reservation process from home to confirmation", async ({
    page,
  }) => {
    // Step 1: Start at home page
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Little Lemon" })
    ).toBeVisible();

    // Step 2: Click Reserve a table button
    await page.getByRole("link", { name: /reserve a table/i }).click();
    await expect(page).toHaveURL("/reservations");

    // Step 3: Fill reservation form
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateString = futureDate.toISOString().split("T")[0];

    await page.getByLabel(/choose date/i).fill(dateString);
    await page.getByLabel(/choose time/i).selectOption("19:30");
    await page.getByLabel(/number of diners/i).fill("6");
    await page.getByLabel(/seating options/i).selectOption("outside");

    // Step 4: Submit reservation form
    await page.getByRole("button", { name: /continue/i }).click();
    await expect(page).toHaveURL("/reservations/customer-details");

    // Step 5: Fill customer details
    await page.getByLabel(/first name/i).fill("Alice");
    await page.getByLabel(/last name/i).fill("Johnson");
    await page.getByLabel(/email/i).fill("alice.johnson@example.com");
    await page.getByLabel(/phone number/i).fill("5551234567");

    // Step 6: Submit customer details
    await page.getByRole("button", { name: /confirm reservation/i }).click();
    await expect(page).toHaveURL("/reservations/payment");

    // Step 7: Verify cardholder names are pre-filled
    await expect(page.getByLabel(/first name/i)).toHaveValue("Alice");
    await expect(page.getByLabel(/last name/i)).toHaveValue("Johnson");

    // Step 8: Fill payment information
    await page.getByLabel(/credit card number/i).fill("4532123456789012");
    await page.getByLabel(/expiration date/i).fill("0826");
    await page.getByLabel(/cvv/i).fill("456");

    // Step 9: Submit payment form
    await page
      .getByRole("button", { name: /confirm and secure reservation/i })
      .click();

    // Step 10: Verify confirmation popup appears
    await expect(
      page.getByRole("heading", { name: /your place is reserved/i })
    ).toBeVisible();

    // Step 11: Verify all reservation details in popup
    await expect(page.getByText(/alice johnson/i)).toBeVisible();
    await expect(page.getByText(/alice\.johnson@example\.com/i)).toBeVisible();
    await expect(page.getByText(/5551234567/i)).toBeVisible();
    await expect(page.getByText(/19:30/)).toBeVisible();
    await expect(page.getByText(/guests:\s*6/i)).toBeVisible();
    await expect(page.getByText(/outside/i)).toBeVisible();

    // Step 12: Click Return to Home
    await page.getByRole("button", { name: /return to home/i }).click();

    // Step 13: Verify back at home page
    await expect(page).toHaveURL("/");
    await expect(
      page.getByRole("heading", { name: "Little Lemon" })
    ).toBeVisible();
  });

  test("should handle validation errors throughout the flow", async ({
    page,
  }) => {
    // Start at reservations page
    await page.goto("/reservations");

    // Try to submit without filling required fields
    await page.getByRole("button", { name: /continue/i }).click();

    // Should stay on reservations page (HTML5 validation)
    await expect(page).toHaveURL("/reservations");

    // Fill reservation form properly
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateString = futureDate.toISOString().split("T")[0];

    await page.getByLabel(/choose date/i).fill(dateString);
    await page.getByLabel(/choose time/i).selectOption("18:00");
    await page.getByLabel(/number of diners/i).fill("2");
    await page.getByRole("button", { name: /continue/i }).click();

    // Now on customer details
    await expect(page).toHaveURL("/reservations/customer-details");

    // Try to submit without filling
    await page.getByRole("button", { name: /confirm reservation/i }).click();

    // Should show validation errors
    await expect(page.getByText(/first name is required/i)).toBeVisible();
    await expect(page).toHaveURL("/reservations/customer-details");

    // Fill customer details properly
    await page.getByLabel(/first name/i).fill("Bob");
    await page.getByLabel(/last name/i).fill("Smith");
    await page.getByLabel(/email/i).fill("bob@example.com");
    await page.getByLabel(/phone number/i).fill("5559876543");
    await page.getByRole("button", { name: /confirm reservation/i }).click();

    // Now on payment page
    await expect(page).toHaveURL("/reservations/payment");

    // Clear pre-filled fields and try to submit
    await page.getByLabel(/first name/i).clear();
    await page
      .getByRole("button", { name: /confirm and secure reservation/i })
      .click();

    // Should show validation errors
    await expect(page.getByText(/required/i).first()).toBeVisible();
    await expect(page).toHaveURL("/reservations/payment");
  });

  test("should maintain state when navigating back and forth", async ({
    page,
  }) => {
    await page.goto("/reservations");

    // Fill reservation form
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateString = futureDate.toISOString().split("T")[0];

    await page.getByLabel(/choose date/i).fill(dateString);
    await page.getByLabel(/choose time/i).selectOption("20:00");
    await page.getByLabel(/number of diners/i).fill("3");
    await page.getByLabel(/seating options/i).selectOption("standard");
    await page.getByRole("button", { name: /continue/i }).click();

    // Fill customer details
    await page.getByLabel(/first name/i).fill("Charlie");
    await page.getByLabel(/last name/i).fill("Brown");
    await page.getByLabel(/email/i).fill("charlie@example.com");
    await page.getByLabel(/phone number/i).fill("5551112222");
    await page.getByRole("button", { name: /confirm reservation/i }).click();

    // Verify we're on payment page with pre-filled names
    await expect(page).toHaveURL("/reservations/payment");
    await expect(page.getByLabel(/first name/i)).toHaveValue("Charlie");
    await expect(page.getByLabel(/last name/i)).toHaveValue("Brown");
  });

  test("should complete reservation with minimum number of diners", async ({
    page,
  }) => {
    await page.goto("/reservations");

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const dateString = futureDate.toISOString().split("T")[0];

    // Test with 1 diner
    await page.getByLabel(/choose date/i).fill(dateString);
    await page.getByLabel(/choose time/i).selectOption("17:00");
    await page.getByLabel(/number of diners/i).fill("1");
    await page.getByRole("button", { name: /continue/i }).click();

    await page.getByLabel(/first name/i).fill("Solo");
    await page.getByLabel(/last name/i).fill("Diner");
    await page.getByLabel(/email/i).fill("solo@example.com");
    await page.getByLabel(/phone number/i).fill("5550000001");
    await page.getByRole("button", { name: /confirm reservation/i }).click();

    await page.getByLabel(/credit card number/i).fill("4532123456789012");
    await page.getByLabel(/expiration date/i).fill("1227");
    await page.getByLabel(/cvv/i).fill("789");
    await page
      .getByRole("button", { name: /confirm and secure reservation/i })
      .click();

    // Verify confirmation shows 1 guest
    await expect(
      page.getByRole("heading", { name: /your place is reserved/i })
    ).toBeVisible();
    await expect(
      page
        .getByText(/guests/i)
        .locator("..")
        .getByText("1")
    ).toBeVisible();
  });

  test("should complete reservation with maximum number of diners", async ({
    page,
  }) => {
    await page.goto("/reservations");

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const dateString = futureDate.toISOString().split("T")[0];

    // Test with 10 diners
    await page.getByLabel(/choose date/i).fill(dateString);
    await page.getByLabel(/choose time/i).selectOption("21:00");
    await page.getByLabel(/number of diners/i).fill("10");
    await page.getByRole("button", { name: /continue/i }).click();

    await page.getByLabel(/first name/i).fill("Big");
    await page.getByLabel(/last name/i).fill("Party");
    await page.getByLabel(/email/i).fill("bigparty@example.com");
    await page.getByLabel(/phone number/i).fill("5559999999");
    await page.getByRole("button", { name: /confirm reservation/i }).click();

    await page.getByLabel(/credit card number/i).fill("5555555555554444");
    await page.getByLabel(/expiration date/i).fill("0930");
    await page.getByLabel(/cvv/i).fill("321");
    await page
      .getByRole("button", { name: /confirm and secure reservation/i })
      .click();

    // Verify confirmation shows 10 guests
    await expect(
      page.getByRole("heading", { name: /your place is reserved/i })
    ).toBeVisible();
    await expect(
      page
        .getByText(/guests/i)
        .locator("..")
        .getByText("10")
    ).toBeVisible();
  });

  test("should work with earliest time slot", async ({ page }) => {
    await page.goto("/reservations");

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    const dateString = futureDate.toISOString().split("T")[0];

    await page.getByLabel(/choose date/i).fill(dateString);
    await page.getByLabel(/choose time/i).selectOption("17:00");
    await page.getByLabel(/number of diners/i).fill("2");
    await page.getByRole("button", { name: /continue/i }).click();

    await page.getByLabel(/first name/i).fill("Early");
    await page.getByLabel(/last name/i).fill("Bird");
    await page.getByLabel(/email/i).fill("early@example.com");
    await page.getByLabel(/phone number/i).fill("5551111111");
    await page.getByRole("button", { name: /confirm reservation/i }).click();

    await page.getByLabel(/credit card number/i).fill("4532123456789012");
    await page.getByLabel(/expiration date/i).fill("0625");
    await page.getByLabel(/cvv/i).fill("111");
    await page
      .getByRole("button", { name: /confirm and secure reservation/i })
      .click();

    await expect(
      page.getByRole("heading", { name: /your place is reserved/i })
    ).toBeVisible();
    await expect(page.getByText(/17:00/)).toBeVisible();
  });

  test("should work with latest time slot", async ({ page }) => {
    await page.goto("/reservations");

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    const dateString = futureDate.toISOString().split("T")[0];

    await page.getByLabel(/choose date/i).fill(dateString);
    await page.getByLabel(/choose time/i).selectOption("22:00");
    await page.getByLabel(/number of diners/i).fill("2");
    await page.getByRole("button", { name: /continue/i }).click();

    await page.getByLabel(/first name/i).fill("Night");
    await page.getByLabel(/last name/i).fill("Owl");
    await page.getByLabel(/email/i).fill("night@example.com");
    await page.getByLabel(/phone number/i).fill("5552222222");
    await page.getByRole("button", { name: /confirm reservation/i }).click();

    await page.getByLabel(/credit card number/i).fill("4532123456789012");
    await page.getByLabel(/expiration date/i).fill("1125");
    await page.getByLabel(/cvv/i).fill("222");
    await page
      .getByRole("button", { name: /confirm and secure reservation/i })
      .click();

    await expect(
      page.getByRole("heading", { name: /your place is reserved/i })
    ).toBeVisible();
    await expect(page.getByText(/22:00/)).toBeVisible();
  });

  test("should handle 4-digit CVV for American Express", async ({ page }) => {
    await page.goto("/reservations");

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 2);
    const dateString = futureDate.toISOString().split("T")[0];

    await page.getByLabel(/choose date/i).fill(dateString);
    await page.getByLabel(/choose time/i).selectOption("19:00");
    await page.getByLabel(/number of diners/i).fill("4");
    await page.getByRole("button", { name: /continue/i }).click();

    await page.getByLabel(/first name/i).fill("Amex");
    await page.getByLabel(/last name/i).fill("User");
    await page.getByLabel(/email/i).fill("amex@example.com");
    await page.getByLabel(/phone number/i).fill("5553333333");
    await page.getByRole("button", { name: /confirm reservation/i }).click();

    // Enter AMEX card with 4-digit CVV
    await page.getByLabel(/credit card number/i).fill("378282246310005");
    await page.getByLabel(/expiration date/i).fill("1228");
    await page.getByLabel(/cvv/i).fill("1234"); // 4 digits for AMEX
    await page
      .getByRole("button", { name: /confirm and secure reservation/i })
      .click();

    await expect(
      page.getByRole("heading", { name: /your place is reserved/i })
    ).toBeVisible();
  });

  test("should display CVV help information when clicked", async ({ page }) => {
    await page.goto("/reservations");

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3);
    const dateString = futureDate.toISOString().split("T")[0];

    await page.getByLabel(/choose date/i).fill(dateString);
    await page.getByLabel(/choose time/i).selectOption("18:30");
    await page.getByLabel(/number of diners/i).fill("2");
    await page.getByRole("button", { name: /continue/i }).click();

    await page.getByLabel(/first name/i).fill("Help");
    await page.getByLabel(/last name/i).fill("Needed");
    await page.getByLabel(/email/i).fill("help@example.com");
    await page.getByLabel(/phone number/i).fill("5554444444");
    await page.getByRole("button", { name: /confirm reservation/i }).click();

    // Click CVV help button
    await page.getByRole("button", { name: /where is my cvv/i }).click();

    // Verify help text is shown
    await expect(page.getByText(/Card Verification Value/i)).toBeVisible();
    await expect(page.getByText(/Visa, Mastercard, Discover/i)).toBeVisible();
    await expect(page.getByText(/American Express/i)).toBeVisible();
  });

  test("should work on mobile viewport", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Complete full flow on mobile
    await page.goto("/");
    await page.getByRole("link", { name: /reserve a table/i }).click();

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateString = futureDate.toISOString().split("T")[0];

    await page.getByLabel(/choose date/i).fill(dateString);
    await page.getByLabel(/choose time/i).selectOption("19:00");
    await page.getByLabel(/number of diners/i).fill("2");
    await page.getByRole("button", { name: /continue/i }).click();

    await page.getByLabel(/first name/i).fill("Mobile");
    await page.getByLabel(/last name/i).fill("User");
    await page.getByLabel(/email/i).fill("mobile@example.com");
    await page.getByLabel(/phone number/i).fill("5555555555");
    await page.getByRole("button", { name: /confirm reservation/i }).click();

    await page.getByLabel(/credit card number/i).fill("4532123456789012");
    await page.getByLabel(/expiration date/i).fill("0626");
    await page.getByLabel(/cvv/i).fill("555");
    await page
      .getByRole("button", { name: /confirm and secure reservation/i })
      .click();

    // Verify confirmation popup is visible and functional on mobile
    await expect(
      page.getByRole("heading", { name: /your place is reserved/i })
    ).toBeVisible();
    await page.getByRole("button", { name: /return to home/i }).click();
    await expect(page).toHaveURL("/");
  });
});
