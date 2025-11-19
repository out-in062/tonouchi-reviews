import { test, expect } from "@playwright/test";

test.describe("Course and Review", () => {
  test("user can navigate from top page to course list page", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Courses" }).click();
    await expect(page).toHaveURL("/courses");
    await expect(page.getByRole("heading", { name: "Courses" })).toBeVisible();
  });
});
