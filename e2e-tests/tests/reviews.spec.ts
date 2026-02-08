import { test, expect } from "@playwright/test";

test.describe("口コミ機能", () => {
  const uniqueId = Date.now();
  const testUser = {
    name: `Review User ${uniqueId}`,
    email: `reviewuser_${uniqueId}@example.com`,
    password: "password123",
    studentId: `REVIEW_${uniqueId}`,
  };

  test.beforeEach(async ({ page }) => {
    // ユーザー作成とログイン
    await page.goto("/signup");
    await page.getByTestId("user-name-input").fill(testUser.name);
    await page.getByTestId("user-email-input").fill(testUser.email);
    await page.getByTestId("user-password-input").fill(testUser.password);
    await page.getByTestId("user-password-confirmation-input").fill(testUser.password);
    await page.getByTestId("user-student-id-input").fill(testUser.studentId);
    await page.getByTestId("signup-submit-button").click();
    await page.waitForURL('**/'); // Wait for the redirect to the homepage
    await expect(page.locator("text=Logged in as")).toBeVisible(); // ログイン確認
    await page.goto("/"); // トップページに遷移
    await page.waitForLoadState('domcontentloaded'); // トップページのロードを待つ
  });

  // ここに各テストケースを実装します。

  // 投稿機能テスト
  test("ログインユーザーが口コミを投稿できる", async ({ page }) => {
    // 仮のレビュー投稿処理
    await page.goto("/courses/1/reviews/new"); // C1コースにレビュー投稿
    await page.waitForLoadState('domcontentloaded');
    await page.getByTestId("review-title-input").fill("素晴らしい授業でした");
    await page.getByTestId("review-rating-input").fill("5");
    await page.getByTestId("review-content-input").fill("内容が充実しており、とてもためになりました。");
    await page.getByTestId("review-submit-button").click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText("Review was successfully created.")).toBeVisible();
    await expect(page).toHaveURL(/\/courses\/\d+/);
  });
  
  // 投稿した口コミが授業詳細ページに表示される
  test("投稿した口コミが授業詳細ページに表示される", async ({ page }) => {
    const reviewTitle = "テスト投稿された口コミ";
    const reviewContent = "この口コミはテストによって投稿されました。";
    
    await page.goto("/courses/1/reviews/new");
    await page.waitForLoadState('domcontentloaded');
    await page.getByTestId("review-title-input").fill(reviewTitle);
    await page.getByTestId("review-rating-input").fill("4");
    await page.getByTestId("review-content-input").fill(reviewContent);
    await page.getByTestId("review-submit-button").click();
    await page.waitForLoadState('domcontentloaded');
    
    await expect(page.getByText(reviewTitle).first()).toBeVisible();
    await expect(page.getByText(reviewContent).first()).toBeVisible();
  });

  // 編集機能テスト
  test("自分の口コミを編集できる", async ({ page }) => {
    const originalTitle = `元のタイトル ${Date.now()}`;
    const updatedTitle = `更新されたタイトル ${Date.now()}`;
    
    // 口コミを投稿
    await page.goto("/courses/1/reviews/new");
    await page.waitForLoadState('domcontentloaded');
    await page.getByTestId("review-title-input").fill(originalTitle);
    await page.getByTestId("review-rating-input").fill("3");
    await page.getByTestId("review-content-input").fill("元の内容です。");
    await page.getByTestId("review-submit-button").click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText("Review was successfully created.")).toBeVisible();
    
    // 投稿された口コミのリンクをクリック
    await page.getByRole("link", { name: originalTitle }).click();
    await page.waitForLoadState('domcontentloaded');
    // 編集ボタンをクリック
    await page.getByRole("link", { name: "Edit" }).click();
    await page.waitForLoadState('domcontentloaded');
    
    // フォームを編集
    await page.getByTestId("review-title-input").fill(updatedTitle);
    await page.getByTestId("review-rating-input").fill("5");
    await page.getByTestId("review-content-input").fill("更新された内容です。");
    await page.getByTestId("review-submit-button").click();
    await page.waitForLoadState('domcontentloaded');
    
    await expect(page.getByText("Review was successfully updated.")).toBeVisible();
    await expect(page.getByText(updatedTitle)).toBeVisible();
    await expect(page.getByText(originalTitle)).not.toBeVisible();
  });

  // 削除機能テスト
  test("自分の口コミを削除できる", async ({ page }) => {
    const titleToDelete = `削除対象の口コミ ${Date.now()}`;
    
    // 口コミを投稿
    await page.goto("/courses/1/reviews/new");
    await page.waitForLoadState('domcontentloaded');
    await page.getByTestId("review-title-input").fill(titleToDelete);
    await page.getByTestId("review-rating-input").fill("2");
    await page.getByTestId("review-content-input").fill("これは削除されます。");
    await page.getByTestId("review-submit-button").click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText("Review was successfully created.")).toBeVisible();
    
    // 投稿された口コミのリンクをクリック
    await page.getByRole("link", { name: titleToDelete }).click();
    await page.waitForLoadState('domcontentloaded');
    // 削除ボタンをクリックし、確認ダイアログを承認
    page.on("dialog", dialog => dialog.accept());
    await page.getByRole("button", { name: "Delete" }).click();
    await page.waitForLoadState('domcontentloaded');
    
    await expect(page.getByText("Review was successfully destroyed.")).toBeVisible();
    await expect(page.getByText(titleToDelete)).not.toBeVisible();
  });

  // 権限チェックテスト: 他人の口コミは編集・削除できない
  test("他人の口コミは編集・削除できない", async ({ page, browser }) => {
    // 別のユーザー (User A) で口コミを投稿
    const userAPage = await browser.newPage();
    const userA = {
      name: `User A ${Date.now()}`,
      email: `user_a_${Date.now()}@example.com`,
      password: "password123",
      studentId: `USERA_${Date.now()}`,
    };

    await userAPage.goto("/signup");
    await userAPage.getByTestId("user-name-input").fill(userA.name);
    await userAPage.getByTestId("user-email-input").fill(userA.email);
    await userAPage.getByTestId("user-password-input").fill(userA.password);
    await userAPage.getByTestId("user-password-confirmation-input").fill(userA.password);
    await userAPage.getByTestId("user-student-id-input").fill(userA.studentId);
    await userAPage.getByTestId("signup-submit-button").click();
    await userAPage.waitForLoadState('domcontentloaded');
    await expect(userAPage.locator("text=Logged in as")).toContainText(userA.name); // ログイン確認
    await userAPage.goto("/"); // トップページに遷移
    await userAPage.waitForLoadState('domcontentloaded'); // トップページのロードを待つ

    await userAPage.goto("/courses/1/reviews/new");
    await userAPage.waitForLoadState('domcontentloaded');
    const userAReviewTitle = `User A Review ${Date.now()}`;
    await userAPage.getByTestId("review-title-input").fill(userAReviewTitle);
    await userAPage.getByTestId("review-rating-input").fill("5");
    await userAPage.getByTestId("review-content-input").fill("Content by User A");
    await userAPage.getByTestId("review-submit-button").click();
    await userAPage.waitForLoadState('domcontentloaded');
    await expect(userAPage.getByText("Review was successfully created.")).toBeVisible();
    userAPage.close();

    // 現在のユーザー (`testUser`) としてログイン済みなので、そのままコース詳細ページに移動
    // `testUser` は `test.beforeEach` でログイン済み
    await page.goto("/courses/1");
    await page.waitForLoadState('domcontentloaded');

    // User A の口コミが表示されていることを確認
    await expect(page.getByText(userAReviewTitle)).toBeVisible();

    // User A の口コミに対する編集・削除ボタンが表示されていないことを確認
    const reviewContainer = page.locator(`.review-card:has-text("${userAReviewTitle}")`).first();
    await expect(reviewContainer.getByRole("link", { name: "Edit" })).not.toBeVisible();
    await expect(reviewContainer.getByRole("button", { name: "Delete" })).not.toBeVisible();
  });

  // 重複投稿防止テスト: 同じ授業に2回目の口コミは投稿できない
  test("同じ授業に2回目の口コミは投稿できない", async ({ page }) => {
    const reviewTitle = `最初の口コミ ${Date.now()}`;
    
    // 最初の口コミを投稿
    await page.goto("/courses/1/reviews/new");
    await page.waitForLoadState('domcontentloaded');
    await page.getByTestId("review-title-input").fill(reviewTitle);
    await page.getByTestId("review-rating-input").fill("5");
    await page.getByTestId("review-content-input").fill("これは最初の口コミです。");
    await page.getByTestId("review-submit-button").click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText("Review was successfully created.")).toBeVisible();
    await expect(page).toHaveURL(/\/courses\/\d+/);

    // 同じ授業に対して再度口コミを投稿しようとする
    await page.goto("/courses/1/reviews/new");
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL("/courses/1"); // コース詳細ページにリダイレクトされることを期待
    await expect(page.getByText("You have already reviewed this course.")).toBeVisible(); // エラーメッセージが表示されることを期待
  });

  // バリデーションテスト: バリデーションエラーが表示される
  test("バリデーションエラーが表示される", async ({ page }) => {
    await page.goto("/courses/1/reviews/new");
    await page.waitForLoadState('domcontentloaded');

    // タイトル、評価、内容を空のまま送信を試みる
    await page.getByTestId("review-submit-button").click();
    await page.waitForLoadState('domcontentloaded');

    // エラーメッセージが表示されることを確認
    // Railsのデフォルトのバリデーションエラー表示を想定しています。
    // 具体的なセレクタはアプリケーションの実装に依存します。
    await expect(page.getByText("Title can't be blank")).toBeVisible();
    await expect(page.getByText("Rating can't be blank")).toBeVisible();
    await expect(page.getByText("Content can't be blank")).toBeVisible();
    await expect(page).toHaveURL(/\/courses\/\d+\/reviews$/); // エラーでページ遷移しないことを確認 (URLはcreateアクションのまま)
  });
});




// 未ログイン状態のテストは、ログインが必要なテストとは分離して記述します。
test.describe("未ログイン時の口コミ機能", () => {
  // 未ログインでは口コミを投稿できない
  test("未ログインでは口コミを投稿できない（ログインページへリダイレクト）", async ({ page }) => {
    await page.goto("/courses/1");
    await page.getByTestId("write-review-link").click();
    await expect(page).toHaveURL("/login");
    await expect(page.getByText("You must be logged in to access this section.")).toBeVisible();
  });
});