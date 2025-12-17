import { test, expect } from "@playwright/test";

test.describe("Course and Review", () => {
  // Test Case 1: Navigate from top to course list
  test("user can navigate from top page to course list page", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByTestId("courses-link").click();
    await expect(page).toHaveURL("/courses");
    await expect(page.getByTestId("courses-heading")).toBeVisible();
  });

  // Test Case 2: View course details
  test("user can view a course detail page", async ({ page }) => {
    // Assumes seed data exists. C0 is created by seeds.
    const courseResponse = await page.goto("/courses");
    expect(courseResponse?.status()).toBe(200);

    // Click on the first course link. Let's make it more robust.
    await page.getByTestId("course-link-C0").click();

    // Check that we are on the correct course page
    await expect(page).toHaveURL(/\/courses\/\d+/);
    await expect(page.getByRole('heading', { name: 'Course 0' })).toBeVisible();
    await expect(page.getByText("Instructor 0")).toBeVisible();
  });

  // Test Cases requiring login
  test.describe("when logged in", () => {
    const uniqueId = Date.now();
    const testUser = {
      name: `Review User ${uniqueId}`,
      email: `reviewuser_${uniqueId}@example.com`,
      password: "password123",
      studentId: `REVIEW_${uniqueId}`,
    };

    // Log in before each test in this block
    test.beforeEach(async ({ page }) => {
      // Create user
      await page.goto("/signup");
      await page.getByTestId("user-name-input").fill(testUser.name);
      await page.getByTestId("user-email-input").fill(testUser.email);
      await page.getByTestId("user-password-input").fill(testUser.password);
      await page
        .getByTestId("user-password-confirmation-input")
        .fill(testUser.password);
      await page.getByTestId("user-student-id-input").fill(testUser.studentId);
      await page.getByTestId("signup-submit-button").click();
      await expect(page.getByText(`Logged in as ${testUser.name}`)).toBeVisible();
    });

    // Test Case 3: Submit a review
    test("user can submit a review for a course", async ({ page }) => {
      await page.goto("/courses");
      await page.getByTestId("course-link-C0").click();

      // Click the button/link to write a review
      await page.getByTestId("write-review-link").click();
      await expect(page).toHaveURL(/\/courses\/\d+\/reviews\/new/);
      
      // Fill out the review form
      const review = {
        title: "Great course!",
        rating: 5,
        content: "This was a fantastic course, highly recommended.",
      };

      await page.getByTestId("review-title-input").fill(review.title);
      await page.getByTestId("review-rating-input").fill(review.rating.toString());
      await page.getByTestId("review-content-input").fill(review.content);
      await page.getByTestId("review-submit-button").click();

      // Check that we are back on the course detail page
      await expect(page).toHaveURL(/\/courses\/\d+/);
      
      // Check that the review is now visible
      await expect(page.getByText(review.title)).toBeVisible();
      await expect(page.getByText(review.content)).toBeVisible();
      await expect(page.getByTestId("review-author")).toBeVisible();
    });
  });
  
  // Test Case 4: Unauthenticated user is redirected
  test("unauthenticated user is redirected to login when trying to review", async ({
    page,
  }) => {
    // Go to a course page that should exist
    await page.goto("/courses");
    await page.getByTestId("course-link-C0").click();
    await expect(page).toHaveURL(/\/courses\/\d+/);

    // Click the link to write a review
    await page.getByTestId("write-review-link").click();

    // Check that we are redirected to the login page
    await expect(page).toHaveURL("/login");
    await expect(
      page.getByText("You must be logged in to access this section.")
    ).toBeVisible();
  });
});
