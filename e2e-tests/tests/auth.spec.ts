import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  const uniqueUserEmail = `testuser_${Date.now()}@example.com`;
  const testUser = {
    name: "Test User",
    email: uniqueUserEmail,
    password: "password123",
    studentId: "TEST12345",
  };

  test("user can sign up successfully", async ({ page }) => {
    await page.goto("/signup");

    await page.getByLabel("Name").fill(testUser.name);
    await page.getByLabel("Email").fill(testUser.email);
    await page.getByLabel("Password", { exact: true }).fill(testUser.password);
    await page.getByLabel("Password confirmation").fill(testUser.password);
    await page.getByLabel("Student id").fill(testUser.studentId);

    await page.getByRole("button", { name: "Sign up" }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByText("User was successfully created.")).toBeVisible();
    await expect(page.getByText(`Logged in as ${testUser.name}`)).toBeVisible();
  });

  test("existing user can log in successfully", async ({ page }) => {
    // First, create a user to log in with
    await page.goto("/signup");
    await page.getByLabel("Name").fill("Login Test User");
    await page.getByLabel("Email").fill(`login_${uniqueUserEmail}`);
    await page.getByLabel("Password", { exact: true }).fill("password123");
    await page.getByLabel("Password confirmation").fill("password123");
    await page.getByRole("button", { name: "Sign up" }).click();
    await page.getByRole("button", { name: "Log out" }).click();
    await expect(page.getByText("Logged out successfully.")).toBeVisible();


    // Now, log in
    await page.goto("/login");

    // The form is not using session scope, so the labels are direct
    await page.getByLabel("Email").fill(`login_${uniqueUserEmail}`);
    await page.getByLabel("Password").fill("password123");

    await page.getByRole("button", { name: "Log in" }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByText("Logged in successfully.")).toBeVisible();
    await expect(page.getByText("Logged in as Login Test User")).toBeVisible();
  });

  test("logged-in user can log out successfully", async ({ page }) => {
    // First, sign up and be logged in
    await page.goto("/signup");
    await page.getByLabel("Name").fill("Logout Test User");
    await page.getByLabel("Email").fill(`logout_${uniqueUserEmail}`);
    await page.getByLabel("Password", { exact: true }).fill("password123");
    await page.getByLabel("Password confirmation").fill("password123");
    await page.getByRole("button", { name: "Sign up" }).click();

    await expect(page.getByText("Logged in as Logout Test User")).toBeVisible();

    // Now, log out
    await page.getByRole("button", { name: "Log out" }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByText("Logged out successfully.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Log in" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign up" })).toBeVisible();
  });
});
