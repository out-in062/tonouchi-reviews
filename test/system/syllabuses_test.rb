require "application_system_test_case"

class SyllabusesTest < ApplicationSystemTestCase
  setup do
    @syllabus = syllabuses(:one)
  end

  test "visiting the index" do
    visit syllabuses_url
    assert_selector "h1", text: "シラバス一覧"
    assert_text "新しいシラバス"
  end

  test "should create syllabus" do
    visit syllabuses_url
    click_on "新しいシラバス"

    # フォームにデータを入力
    fill_in "科目コード", with: 999
    fill_in "科目名", with: "システムテスト科目"
    
    click_on "登録する"

    # 成功メッセージの確認
    assert_text "シラバスを登録しました。"
    # 新しく作成されたデータの表示確認
    assert_text "999"
    assert_text "システムテスト科目"
  end

  test "should update Syllabus" do
    visit syllabus_url(@syllabus)
    click_on "編集", match: :first

    # フォームの値を変更
    fill_in "科目コード", with: @syllabus.code
    fill_in "科目名", with: "更新されたテスト科目"
    
    # 更新ボタンをクリック
    click_on "更新する"

    # 成功メッセージの確認
    assert_text "シラバスを更新しました。"
    # 更新されたデータの表示確認
    assert_text "更新されたテスト科目"
  end

  test "should show syllabus details" do
    visit syllabus_url(@syllabus)
    
    # 詳細ページの内容確認
    assert_text @syllabus.name
    assert_text @syllabus.code.to_s
    
    # ナビゲーションリンクの確認
    assert_link "編集"
    assert_link "戻る"
  end

  test "should validate syllabus creation with invalid data" do
    visit syllabuses_url
    click_on "新しいシラバス"

    # 無効なデータ（空のname）で作成を試行
    fill_in "科目コード", with: 888
    fill_in "科目名", with: ""
    
    click_on "登録する"

    # エラーメッセージの確認（バリデーションエラー）
    # 注：rack_testドライバーではJavaScriptが動作しないため、
    # サーバーサイドバリデーションのみテスト可能
    assert_text "科目名 を入力してください"
  end

  test "should navigate between pages" do
    # 一覧ページから詳細ページへ
    visit syllabuses_url
    
    # Show リンクを使って詳細ページへ移動
    first("a", text: "詳細").click
    
    # どちらかのfixtureデータが表示されることを確認
    page_text = page.text
    has_syllabus_data = page_text.include?("テスト科目1") || page_text.include?("テスト科目2")
    assert has_syllabus_data, "Expected to find syllabus data on the page"
    
    # 詳細ページから一覧ページへ戻る
    click_on "戻る"
    assert_current_path syllabuses_path
    assert_selector "h1", text: "シラバス一覧"  # 日本語に変更
  end

  # rack_testドライバーではJavaScriptの確認ダイアログが動作しないため
  # destroy機能のテストはコメントアウト
  # Selenium + Chrome環境でのみ動作します
  # test "should destroy Syllabus" do
  #   visit syllabus_url(@syllabus)
  #   
  #   # 削除の確認ダイアログが表示される（JavaScript必須）
  #   accept_confirm do
  #     click_on "Destroy this syllabus", match: :first
  #   end
  #
  #   assert_text "Syllabus was successfully destroyed"
  # end
end