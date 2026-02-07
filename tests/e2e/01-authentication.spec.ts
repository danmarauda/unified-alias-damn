import { test, expect } from "@playwright/test";

/**
 * Authentication Flow Tests
 * Tests WorkOS authentication flow: login → callback → dashboard
 */

test.describe("Authentication Flow", () => {
  test("should redirect unauthenticated users to login", async ({ page }) => {
    // Visit protected dashboard page
    await page.goto("/");

    // Should redirect to WorkOS login
    await page.waitForURL(/login|authkit/, { timeout: 10000 });

    // Verify we're on login/auth page
    const url = page.url();
    expect(url).toMatch(/login|authkit/);
  });

  test("should display login page elements", async ({ page }) => {
    await page.goto("/login");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Verify login UI elements are present
    const title = page.locator("h1, h2").first();
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test("should handle authentication callback", async ({ page }) => {
    // Note: This test simulates the callback flow
    // In production, you'd need to mock the WorkOS response
    await page.goto("/callback?code=test_code&state=test_state");

    // Should process callback (may redirect or show error for test code)
    await page.waitForLoadState("networkidle");

    // Verify we're not stuck on callback page
    const url = page.url();
    expect(url).not.toContain("/callback");
  });
});

test.describe("Dashboard Access (Authenticated)", () => {
  test.skip("should access dashboard when authenticated", async ({ page }) => {
    // This test requires actual authentication
    // Skip for now - would need WorkOS test credentials
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Dashboard");
  });
});
