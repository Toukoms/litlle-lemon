import { expect, test } from "@playwright/test";

test.describe("ReservationsPage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/reservations");
  });

  test("should display the page title and description", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Little Lemon" })
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Chicago" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /reserve a table/i })
    ).toBeVisible();
    await expect(
      page.getByText(/Book your table at Little Lemon/i)
    ).toBeVisible();
  });

  test("should display all form fields", async ({ page }) => {
    // Check for date field
    await expect(page.getByLabel(/choose date/i)).toBeVisible();

    // Check for time field
    await expect(page.getByLabel(/choose time/i)).toBeVisible();

    // Check for number of diners field
    await expect(page.getByLabel(/number of diners/i)).toBeVisible();

    // Check for seating options field
    await expect(page.getByLabel(/seating options/i)).toBeVisible();

    // Check for submit button
    await expect(page.getByRole("button", { name: /continue/i })).toBeVisible();
  });

  test("should have default values", async ({ page }) => {
    // Number of diners should default to 2
    const dinersInput = page.getByLabel(/number of diners/i);
    await expect(dinersInput).toHaveValue("2");

    // Seating should default to standard
    const seatingSelect = page.getByLabel(/seating options/i);
    await expect(seatingSelect).toHaveValue("standard");
  });

  test("should display time options from 17:00 to 22:00", async ({ page }) => {
    const timeSelect = page.getByLabel(/choose time/i);

    // Check that the select contains the expected options
    const optionTexts = await timeSelect.locator("option").allTextContents();

    expect(optionTexts).toContain("17:00");
    expect(optionTexts).toContain("18:00");
    expect(optionTexts).toContain("19:00");
    expect(optionTexts).toContain("20:00");
    expect(optionTexts).toContain("21:00");
    expect(optionTexts).toContain("22:00");
  });

  test("should display seating options", async ({ page }) => {
    const seatingSelect = page.getByLabel(/seating options/i);

    // Check that the select contains the expected options
    const optionTexts = await seatingSelect.locator("option").allTextContents();

    expect(optionTexts).toContain("Standard");
    expect(optionTexts).toContain("Outside");
  });

  test("should require all fields to be filled", async ({ page }) => {
    // Try to submit without filling anything
    const submitButton = page.getByRole("button", { name: /continue/i });
    await submitButton.click();

    // Should not navigate away (stay on same page)
    await expect(page).toHaveURL("/reservations");
  });

  test("should accept valid date input", async ({ page }) => {
    const dateInput = page.getByLabel(/choose date/i);

    // Fill with a future date
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateString = futureDate.toISOString().split("T")[0];

    await dateInput.fill(dateString);
    await expect(dateInput).toHaveValue(dateString);
  });

  test("should accept time selection", async ({ page }) => {
    const timeSelect = page.getByLabel(/choose time/i);

    await timeSelect.selectOption("19:00");
    await expect(timeSelect).toHaveValue("19:00");
  });

  test("should accept number of diners between 1 and 10", async ({ page }) => {
    const dinersInput = page.getByLabel(/number of diners/i);

    // Test minimum
    await dinersInput.fill("1");
    await expect(dinersInput).toHaveValue("1");

    // Test maximum
    await dinersInput.fill("10");
    await expect(dinersInput).toHaveValue("10");

    // Test mid-range
    await dinersInput.fill("5");
    await expect(dinersInput).toHaveValue("5");
  });

  test("should change seating option", async ({ page }) => {
    const seatingSelect = page.getByLabel(/seating options/i);

    // Change to Outside
    await seatingSelect.selectOption("outside");
    await expect(seatingSelect).toHaveValue("outside");

    // Change back to Standard
    await seatingSelect.selectOption("standard");
    await expect(seatingSelect).toHaveValue("standard");
  });

  test("should navigate to customer details when form is valid", async ({
    page,
  }) => {
    // Fill all required fields
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateString = futureDate.toISOString().split("T")[0];

    await page.getByLabel(/choose date/i).fill(dateString);
    await page.getByLabel(/choose time/i).selectOption("19:00");
    await page.getByLabel(/number of diners/i).fill("4");
    await page.getByLabel(/seating options/i).selectOption("outside");

    // Submit the form
    await page.getByRole("button", { name: /continue/i }).click();

    // Should navigate to customer details page
    await expect(page).toHaveURL("/reservations/customer-details");
  });

  test("should have proper input constraints", async ({ page }) => {
    const dinersInput = page.getByLabel(/number of diners/i);

    // Check min and max attributes
    await expect(dinersInput).toHaveAttribute("min", "1");
    await expect(dinersInput).toHaveAttribute("max", "10");
    await expect(dinersInput).toHaveAttribute("type", "number");

    // Check date input type
    const dateInput = page.getByLabel(/choose date/i);
    await expect(dateInput).toHaveAttribute("type", "date");
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Check elements are still visible and usable
    await expect(
      page.getByRole("heading", { name: /reserve a table/i })
    ).toBeVisible();
    await expect(page.getByLabel(/choose date/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /continue/i })).toBeVisible();
  });

  test("should have proper focus states", async ({ page }) => {
    const dateInput = page.getByLabel(/choose date/i);

    // Focus on the input
    await dateInput.focus();

    // Input should be focused
    await expect(dateInput).toBeFocused();
  });
});
