import { expect, test } from "@playwright/test";

test.describe("HomePage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display the page title and branding", async ({ page }) => {
    // Check for Little Lemon branding
    await expect(
      page.getByRole("heading", { name: "Little Lemon" })
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Chicago" })).toBeVisible();
  });

  test("should display the restaurant description", async ({ page }) => {
    // Check for description text
    await expect(page.getByText(/We are a family owned/i)).toBeVisible();
    await expect(page.getByText(/Mediterranean restaurant/i)).toBeVisible();
  });

  test("should display the hero image", async ({ page }) => {
    // Check hero image is present
    const heroImage = page.getByAltText(/woman bring sausage/i);
    await expect(heroImage).toBeVisible();
  });

  test("should have a Reserve a table button that navigates to reservations page", async ({
    page,
  }) => {
    // Find and click the Reserve button
    const reserveButton = page.getByRole("link", { name: /reserve a table/i });
    await expect(reserveButton).toBeVisible();

    await reserveButton.click();

    // Check navigation to reservations page
    await expect(page).toHaveURL("/reservations");
    await expect(
      page.getByRole("heading", { name: /reserve a table/i })
    ).toBeVisible();
  });

  test('should display "ORDER FOR DELIVERY!" section', async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /order for delivery/i })
    ).toBeVisible();
  });

  test("should display dish categories", async ({ page }) => {
    // Check for category buttons
    await expect(page.getByRole("button", { name: "Lunch" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Mains" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Desserts" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "A la carte" })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Starters" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Drinks" })).toBeVisible();
  });

  test("should display dish cards with all information", async ({ page }) => {
    // Check Greek Salad
    await expect(
      page.getByRole("heading", { name: "Greek Salad" })
    ).toBeVisible();
    await expect(page.getByText(/\$12.99/)).toBeVisible();
    await expect(page.getByText(/The famous greek salad/i)).toBeVisible();

    // Check Bruschetta
    await expect(
      page.getByRole("heading", { name: "Bruschetta" })
    ).toBeVisible();
    await expect(page.getByText(/\$5.99/)).toBeVisible();
    await expect(page.getByText(/Our Bruschetta is made/i)).toBeVisible();

    // Check Grilled Fish
    await expect(
      page.getByRole("heading", { name: "Grilled Fish" })
    ).toBeVisible();
    await expect(page.getByText(/\$15.99/)).toBeVisible();
    await expect(
      page.getByText(/Served with lemon and vegetables/i)
    ).toBeVisible();
  });

  test("should display dish images", async ({ page }) => {
    // Check all dish images are present
    await expect(page.getByAltText("Greek Salad")).toBeVisible();
    await expect(page.getByAltText("Bruschetta")).toBeVisible();
    await expect(page.getByAltText("Grilled Fish")).toBeVisible();
  });

  test("should have header with logo and icons", async ({ page }) => {
    // Check for logo
    await expect(page.getByAltText(/logo little lemon/i)).toBeVisible();
  });

  test("should have footer", async ({ page }) => {
    // Scroll to footer to ensure it's visible
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Footer should exist (check if it's in the DOM)
    const footer = page.locator("footer");
    await expect(footer).toBeAttached();
  });

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check elements are still visible
    await expect(
      page.getByRole("heading", { name: "Little Lemon" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /reserve a table/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Greek Salad" })
    ).toBeVisible();
  });
});
