import { test, expect } from "@playwright/test";

/**
 * Navigation Tests
 * Tests core navigation and page rendering
 */

test.describe("Page Navigation", () => {
  test("should render homepage", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Verify page loaded successfully
    expect(page.url()).toContain("localhost:3000");
  });

  test("should navigate to agent metrics page", async ({ page }) => {
    await page.goto("/agents/metrics");
    await page.waitForLoadState("networkidle");

    // Verify we're on the metrics page
    expect(page.url()).toContain("/agents/metrics");
  });

  test("should navigate to agent library page", async ({ page }) => {
    await page.goto("/agents/library");
    await page.waitForLoadState("networkidle");

    expect(page.url()).toContain("/agents/library");
  });

  test("should navigate to projects page", async ({ page }) => {
    await page.goto("/projects");
    await page.waitForLoadState("networkidle");

    expect(page.url()).toContain("/projects");
  });

  test("should navigate to client profiles page", async ({ page }) => {
    await page.goto("/client-profiles");
    await page.waitForLoadState("networkidle");

    expect(page.url()).toContain("/client-profiles");
  });

  test("should navigate to ontology editor", async ({ page }) => {
    await page.goto("/ontology");
    await page.waitForLoadState("networkidle");

    expect(page.url()).toContain("/ontology");
  });
});
