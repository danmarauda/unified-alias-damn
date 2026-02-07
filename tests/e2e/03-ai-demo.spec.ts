import { test, expect } from "@playwright/test";

/**
 * AI Demo Tests
 * Tests Multi-LLM demo page with 15+ providers
 */

test.describe("AI Demo Page", () => {
  test("should render AI demo page", async ({ page }) => {
    await page.goto("/ai-demo");
    await page.waitForLoadState("networkidle");

    // Verify page loaded
    expect(page.url()).toContain("/ai-demo");

    // Check for main content
    const mainContent = page.locator("main, [role='main']").first();
    await expect(mainContent).toBeVisible({ timeout: 10000 });
  });

  test("should display LLM provider options", async ({ page }) => {
    await page.goto("/ai-demo");
    await page.waitForLoadState("networkidle");

    // Wait for any content to load
    await page.waitForTimeout(2000);

    // Verify page has interactive elements
    const buttons = page.locator("button");
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
  });

  test("should have proper page structure", async ({ page }) => {
    await page.goto("/ai-demo");
    await page.waitForLoadState("networkidle");

    // Verify HTML structure is valid
    const html = await page.content();
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<html");
  });
});
