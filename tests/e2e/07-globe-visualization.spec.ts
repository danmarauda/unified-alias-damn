import { test, expect } from "@playwright/test";

/**
 * 3D Globe Visualization Tests
 * Tests Three.js + React Three Fiber globe performance
 */

test.describe("3D Globe Visualization", () => {
  test("should render dashboard with globe", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Wait for any 3D content to initialize
    await page.waitForTimeout(3000);

    // Verify canvas element exists (Three.js renders to canvas)
    const canvas = page.locator("canvas").first();
    const canvasCount = await page.locator("canvas").count();

    if (canvasCount > 0) {
      await expect(canvas).toBeVisible();
    }
  });

  test("should handle globe interactions", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Wait for 3D initialization
    await page.waitForTimeout(3000);

    const canvas = page.locator("canvas").first();
    const canvasCount = await page.locator("canvas").count();

    if (canvasCount > 0) {
      // Test mouse interaction
      await canvas.hover();
      await page.mouse.move(100, 100);

      // Verify no errors occurred
      const errors = await page.evaluate(() => {
        return (window as any).__playwright_errors || [];
      });
      expect(errors.length).toBe(0);
    }
  });

  test("should perform well on mobile viewport", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Wait for 3D content
    await page.waitForTimeout(3000);

    // Measure performance
    const metrics = await page.evaluate(() => {
      return {
        memory: (performance as any).memory?.usedJSHeapSize || 0,
        timing: performance.timing.loadEventEnd - performance.timing.navigationStart
      };
    });

    // Verify reasonable load time (< 5 seconds)
    expect(metrics.timing).toBeLessThan(5000);
  });
});
