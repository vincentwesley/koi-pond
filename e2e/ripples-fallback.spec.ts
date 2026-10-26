import { test } from "@playwright/test";

// Enable after the ripple fallback branch merges.
test.fixme("ripple fallback renders without float render targets", async ({ page }) => {
  await page.goto("/");
});
