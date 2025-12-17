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
        title: `Great course! ${Date.now()}`, // Make title unique
        rating: 5,
        content: `This was a fantastic course, highly recommended. Review ID: ${Date.now()}`, // Make content unique
      };

      await page.getByTestId("review-title-input").fill(review.title);
      await page.getByTestId("review-rating-input").fill(review.rating.toString());
      await page.getByTestId("review-content-input").fill(review.content);
      await page.getByTestId("review-submit-button").click();

      // Check that we are back on the course detail page
      await expect(page).toHaveURL(/\/courses\/\d+/);
      
      // Check that the review is now visible
      const reviewContainer = page.locator(`.bg-gray-50:has-text("${review.title}")`).first();
      await expect(reviewContainer.getByText(review.content)).toBeVisible();
      await expect(reviewContainer.getByTestId("review-author")).toBeVisible();
    });

    test("user can edit their own review", async ({ page }) => {
      await page.goto("/courses");
      await page.getByTestId("course-link-C0").click();

      // Submit a review first
      await page.getByTestId("write-review-link").click();
      const originalTitle = `Original Title ${Date.now()}`;
      await page.getByTestId("review-title-input").fill(originalTitle);
      await page.getByTestId("review-rating-input").fill("4");
      await page.getByTestId("review-content-input").fill("Original content.");
      await page.getByTestId("review-submit-button").click();

      // Go to the review and edit it
      await page.getByRole("link", { name: originalTitle }).click();
      await page.getByRole("link", { name: "Edit" }).click();
      
      const updatedTitle = `Updated Title ${Date.now()}`;
      await page.getByTestId("review-title-input").fill(updatedTitle);
      await page.getByTestId("review-submit-button").click();

      await expect(page.getByText("Review was successfully updated.")).toBeVisible();
      await expect(page.getByRole("heading", { name: updatedTitle })).toBeVisible();
    });

    test("user can delete their own review", async ({ page }) => {
      await page.goto("/courses");
      await page.getByTestId("course-link-C0").click();

      // Submit a review first
      await page.getByTestId("write-review-link").click();
      const titleToDelete = `To Delete ${Date.now()}`;
      await page.getByTestId("review-title-input").fill(titleToDelete);
      await page.getByTestId("review-rating-input").fill("1");
      await page.getByTestId("review-content-input").fill("This will be deleted.");
      await page.getByTestId("review-submit-button").click();

      // Go to the review and delete it
      await page.getByRole("link", { name: titleToDelete }).click();
      page.on("dialog", dialog => dialog.accept());
      await page.getByRole("button", { name: "Delete" }).click();
      
      await expect(page.getByText("Review was successfully destroyed.")).toBeVisible();
      await expect(page.getByText(titleToDelete)).not.toBeVisible();
    });

    test("user cannot see edit/delete buttons on another user's review", async ({ browser }) => {
      // Create a review as the first user
      const page1 = await browser.newPage();
      await page1.goto("/signup");
      await page1.getByTestId("user-name-input").fill("User A");
      await page1.getByTestId("user-email-input").fill(`user_a_${Date.now()}@example.com`);
      await page1.getByTestId("user-password-input").fill("password");
      await page1.getByTestId("user-password-confirmation-input").fill("password");
      await page1.getByTestId("user-student-id-input").fill(`USERA_${Date.now()}`);
      await page1.getByTestId("signup-submit-button").click();
      
      await page1.goto("/courses/1/reviews/new");
      const reviewTitle = `User A Review ${Date.now()}`;
      await page1.getByTestId("review-title-input").fill(reviewTitle);
      await page1.getByTestId("review-rating-input").fill("5");
      await page1.getByTestId("review-content-input").fill("Content by User A");
      await page1.getByTestId("review-submit-button").click();
      await page1.close();

      // As the second user, view the course page
      const page2 = await browser.newPage();
      await page2.goto("/courses/1");

      const reviewContainer = page2.locator(`.bg-gray-50:has-text("${reviewTitle}")`).first();
      await expect(reviewContainer.getByRole("link", { name: "Edit" })).not.toBeVisible();
      await expect(reviewContainer.getByRole("button", { name: "Delete" })).not.toBeVisible();
      await page2.close();
    });

    test("user cannot submit more than one review for the same course", async ({ page }) => {
      // Submit a review for the first time
      await page.goto("/courses/1/reviews/new");
      await page.getByTestId("review-title-input").fill("First Review");
      await page.getByTestId("review-rating-input").fill("5");
      await page.getByTestId("review-content-input").fill("This is the first review.");
      await page.getByTestId("review-submit-button").click();
      await expect(page.getByText("Review was successfully created.")).toBeVisible();

      // Attempt to submit a second review
      await page.goto("/courses/1/reviews/new");
      await expect(page.getByText("You have already reviewed this course.")).toBeVisible();
      await expect(page).toHaveURL("/courses/1");
    });

    test("user can react to a review", async ({ page }) => {
      // First, create a review to react to
      await page.goto("/courses/1/reviews/new");
      const reviewTitle = `Reactable Review ${Date.now()}`;
      await page.getByTestId("review-title-input").fill(reviewTitle);
      await page.getByTestId("review-rating-input").fill("5");
      await page.getByTestId("review-content-input").fill("Content to react to.");
      await page.getByTestId("review-submit-button").click();

      // Go to the course page and find the review
      await page.goto("/courses/1");
      const reviewContainer = page.locator(`.bg-gray-50:has-text("${reviewTitle}")`).first();

      // React to the review
      await reviewContainer.getByRole("button", { name: /👍 Helpful/ }).click();
      await expect(page.getByText("Reaction saved.")).toBeVisible();
      await expect(reviewContainer.getByRole("button", { name: "👍 Helpful (1)" })).toBeVisible();

      // Change reaction
      await reviewContainer.getByRole("button", { name: /👎 Not Helpful/ }).click();
      await expect(page.getByText("Reaction saved.")).toBeVisible();
      await expect(reviewContainer.getByRole("button", { name: "👍 Helpful (0)" })).toBeVisible();
      await expect(reviewContainer.getByRole("button", { name: "👎 Not Helpful (1)" })).toBeVisible();
    });
  });
  
  // Test Case 4: Unauthenticated user is redirected
  test.describe("when unauthenticated", () => {
    test("user is redirected to login when trying to review", async ({
      page,
    }) => {
      // Go to a course page that should exist
      await page.goto("/courses/1");

      // Click the link to write a review
      await page.getByTestId("write-review-link").click();

      // Check that we are redirected to the login page
      await expect(page).toHaveURL("/login");
      await expect(
        page.getByText("You must be logged in to access this section.")
      ).toBeVisible();
    });

    test("user is redirected when trying to edit a review", async ({ page }) => {
      // Assume review with ID 1 exists from seeds or previous tests
      await page.goto("/reviews/1/edit");
      await expect(page).toHaveURL("/login");
      await expect(
        page.getByText("You must be logged in to access this section.")
      ).toBeVisible();
    });
  });
});
