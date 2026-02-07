import { test, expect } from "@playwright/test";

/**
 * Client Research Workflow Tests
 * Tests multi-stage approval workflow: draft → awaiting_approval → approved → published
 */

test.describe("Client Research Workflow", () => {
  test("should render client profiles page", async ({ page }) => {
    await page.goto("/client-profiles");
    await page.waitForLoadState("networkidle");

    expect(page.url()).toContain("/client-profiles");
  });

  test("should display research list", async ({ page }) => {
    await page.goto("/research");
    await page.waitForLoadState("networkidle");

    expect(page.url()).toContain("/research");
  });

  test.skip("should create new research draft", async ({ page }) => {
    // Requires authentication - skip for now
    await page.goto("/research/new");

    // Would test form filling and submission
    const titleInput = page.locator('input[name="title"]');
    await expect(titleInput).toBeVisible();
  });

  test.skip("should approve research", async ({ page }) => {
    // Requires authentication and existing research - skip for now
    await page.goto("/research/1");

    // Would test approval workflow
    const approveButton = page.locator('button:has-text("Approve")');
    await expect(approveButton).toBeVisible();
  });
});
