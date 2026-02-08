import { Page, test, expect } from '@playwright/test';

export async function login(page: Page, name: string, email: string, password_actual: string) {
  const uniqueId = Date.now();
  const testUser = {
    name: name,
    email: email,
    password: password_actual,
    studentId: `TEST_${uniqueId}`,
  };

  await page.goto("/signup");

  await page.getByTestId("user-name-input").fill(testUser.name);
  await page.getByTestId("user-email-input").fill(testUser.email);
  await page.getByTestId("user-password-input").fill(testUser.password);
  await page.getByTestId("user-password-confirmation-input").fill(testUser.password);
  await page.getByTestId("user-student-id-input").fill(testUser.studentId);

  await page.getByTestId("signup-submit-button").click();
  await page.getByTestId("logout-button").click();
  await page.getByTestId("login-link").click();

  await page.getByTestId("login-email-input").fill(testUser.email);
  await page.getByTestId("login-password-input").fill(testUser.password);
  await page.getByTestId("login-submit-button").click();

  await expect(page).toHaveURL("/");
  await expect(page.getByText(`Logged in as ${testUser.name}`)).toBeVisible();
}