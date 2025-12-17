import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("user can sign up successfully", async ({ page }) => {
    const uniqueId = Date.now();
    const testUser = {
      name: `Test User ${uniqueId}`,
      email: `testuser_${uniqueId}@example.com`,
      password: "password123",
      studentId: `TEST_${uniqueId}`,
    };

    await page.goto("/signup");

    await page.getByTestId("user-name-input").fill(testUser.name);
    await page.getByTestId("user-email-input").fill(testUser.email);
    await page.getByTestId("user-password-input").fill(testUser.password);
    await page.getByTestId("user-password-confirmation-input").fill(testUser.password);
    await page.getByTestId("user-student-id-input").fill(testUser.studentId);

    await page.getByTestId("signup-submit-button").click();

    await expect(page).toHaveURL("/");
    // The flash message might vary, let's check for the successful login text instead.
    await expect(page.getByText(`Logged in as ${testUser.name}`)).toBeVisible();
  });

  test("existing user can log in successfully", async ({ page }) => {
    const uniqueId = Date.now();
    const testUser = {
      name: `Login Test User ${uniqueId}`,
      email: `login_${uniqueId}@example.com`,
      password: "password123",
      studentId: `LOGIN_${uniqueId}`,
    };

    // First, create a user to log in with via a direct backend call or a separate setup function.
    // For simplicity here, we'll quickly sign them up through the UI.
    await page.goto("/signup");
    await page.getByTestId("user-name-input").fill(testUser.name);
    await page.getByTestId("user-email-input").fill(testUser.email);
    await page.getByTestId("user-password-input").fill(testUser.password);
    await page.getByTestId("user-password-confirmation-input").fill(testUser.password);
    await page.getByTestId("user-student-id-input").fill(testUser.studentId);
    await page.getByTestId("signup-submit-button").click();
    
    // Ensure signup was successful and we are logged in, then log out.
    await expect(page.getByText(`Logged in as ${testUser.name}`)).toBeVisible();
    await page.getByTestId("logout-button").click();
    await expect(page.getByText("Logged out successfully.")).toBeVisible();

    // Now, log in
    await page.goto("/login");
    await page.getByTestId("login-email-input").fill(testUser.email);
    await page.getByTestId("login-password-input").fill(testUser.password);
    await page.getByTestId("login-submit-button").click();

    await expect(page).toHaveURL("/");
    await expect(page.getByText("Logged in successfully.")).toBeVisible();
    await expect(page.getByText(`Logged in as ${testUser.name}`)).toBeVisible();
  });

  test("logged-in user can log out successfully", async ({ page }) => {
    const uniqueId = Date.now();
    const testUser = {
      name: `Logout Test User ${uniqueId}`,
      email: `logout_${uniqueId}@example.com`,
      password: "password123",
      studentId: `LOGOUT_${uniqueId}`,
    };
    
    // First, sign up and be logged in
    await page.goto("/signup");
    await page.getByTestId("user-name-input").fill(testUser.name);
    await page.getByTestId("user-email-input").fill(testUser.email);
    await page.getByTestId("user-password-input").fill(testUser.password);
    await page.getByTestId("user-password-confirmation-input").fill(testUser.password);
    await page.getByTestId("user-student-id-input").fill(testUser.studentId);
    await page.getByTestId("signup-submit-button").click();

    // Make sure we're logged in
    await expect(page.getByText(`Logged in as ${testUser.name}`)).toBeVisible();

    // Now, log out
    await page.getByTestId("logout-button").click();

    await expect(page).toHaveURL("/");
    await expect(page.getByText("Logged out successfully.")).toBeVisible();
    await expect(page.getByTestId("login-link")).toBeVisible();
    await expect(page.getByTestId("signup-link")).toBeVisible();
  });
});
