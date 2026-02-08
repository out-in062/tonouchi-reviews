import { test, expect } from '@playwright/test';
import { login } from '../support/login';

test.describe('口コミ機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('ログインユーザーが口コミを投稿できる', async ({ page }) => {
    await login(page, 'testuser', 'testuser@example.com', 'password');

    await page.goto('/');
    await page.click('a[href*="/courses/"]');
    await page.click('text=Write a Review');

    const review = {
      title: 'This is a test review',
      content: 'This is the content of the test review.',
      rating: 5,
    };

    await page.fill('input[name="review[title]"]', review.title);
    await page.fill('textarea[name="review[content]"]', review.content);
    await page.selectOption('select[name="review[rating]"]', String(review.rating));

    await page.click('input[type="submit"]');

    await expect(page.locator('text=Review was successfully created.')).toBeVisible();
    await expect(page.locator(`text=${review.title}`)).toBeVisible();
    await expect(page.locator(`text=${review.content}`)).toBeVisible();
    await expect(page.locator('text=testuser')).toBeVisible();
  });

  test('自分の口コミを編集できる', async ({ page }) => {
    await login(page, 'edituser', 'edituser@example.com', 'password');

    await page.goto('/');
    await page.click('a[href*="/courses/"]'); // Navigate to a course page

    // Post a review first
    await page.click('text=Write a Review');
    const originalReview = {
      title: 'Original Review Title',
      content: 'This is the original content of the review.',
      rating: 4,
    };
    await page.fill('input[name="review[title]"]', originalReview.title);
    await page.fill('textarea[name="review[content]"]', originalReview.content);
    await page.selectOption('select[name="review[rating]"]', String(originalReview.rating));
    await page.click('input[type="submit"]');
    await expect(page.locator('text=Review was successfully created.')).toBeVisible();
    await expect(page.locator(`text=${originalReview.title}`)).toBeVisible();

    // Now edit the review
    await page.click(`a[href*="/reviews/"][href*="/edit"]`); // Click edit button for the review
    const updatedReview = {
      title: 'Updated Review Title',
      content: 'This is the updated content of the review.',
      rating: 5,
    };
    await page.fill('input[name="review[title]"]', updatedReview.title);
    await page.fill('textarea[name="review[content]"]', updatedReview.content);
    await page.selectOption('select[name="review[rating]"]', String(updatedReview.rating));
    await page.click('input[type="submit"]');

    await expect(page.locator('text=Review was successfully updated.')).toBeVisible();
    await expect(page.locator(`text=${updatedReview.title}`)).toBeVisible();
    await expect(page.locator(`text=${updatedReview.content}`)).toBeVisible();
    await expect(page.locator(`text=${originalReview.title}`)).not.toBeVisible(); // Original title should no longer be visible
  });

  test('自分の口コミを削除できる', async ({ page }) => {
    await login(page, 'deleteuser', 'deleteuser@example.com', 'password');

    await page.goto('/');
    await page.click('a[href*="/courses/"]'); // Navigate to a course page

    // Post a review first
    await page.click('text=Write a Review');
    const reviewToDelete = {
      title: 'Review to Delete',
      content: 'This review will be deleted.',
      rating: 3,
    };
    await page.fill('input[name="review[title]"]', reviewToDelete.title);
    await page.fill('textarea[name="review[content]"]', reviewToDelete.content);
    await page.selectOption('select[name="review[rating]"]', String(reviewToDelete.rating));
    await page.click('input[type="submit"]');
    await expect(page.locator('text=Review was successfully created.')).toBeVisible();
    await expect(page.locator(`text=${reviewToDelete.title}`)).toBeVisible();

    // Now delete the review
    page.on('dialog', async dialog => {
      expect(dialog.type()).toContain('confirm');
      expect(dialog.message()).toContain('Are you sure you want to delete this review?');
      await dialog.accept();
    });
    await page.click('button:has-text("Delete")');

    await expect(page.locator('text=Review was successfully destroyed.')).toBeVisible();
    await expect(page.locator(`text=${reviewToDelete.title}`)).not.toBeVisible();
  });

  test('同じ授業に2回目の口コミは投稿できない', async ({ page }) => {
    await login(page, 'reviewer', 'reviewer@example.com', 'password');

    await page.goto('/');
    await page.click('a[href*="/courses/"]'); // Navigate to a course page
    const coursePath = page.url();

    // Post a first review
    await page.click('text=Write a Review');
    const firstReview = {
      title: 'First Review for Course',
      content: 'This is the first review content.',
      rating: 5,
    };
    await page.fill('input[name="review[title]"]', firstReview.title);
    await page.fill('textarea[name="review[content]"]', firstReview.content);
    await page.selectOption('select[name="review[rating]"]', String(firstReview.rating));
    await page.click('input[type="submit"]');
    await expect(page.locator('text=Review was successfully created.')).toBeVisible();
    await expect(page.locator(`text=${firstReview.title}`)).toBeVisible();

    // Try to write another review for the same course
    await page.goto(coursePath); // Go back to the course page
    await expect(page.locator('text=Write a Review')).not.toBeVisible();
  });
});
