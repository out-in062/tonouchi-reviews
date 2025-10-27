require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    # get "signup", to: "users#new" に対応するパス
    get signup_path
    assert_response :success
  end

  # 'create' アクションは通常POSTリクエストです
  test "should post create" do
    # resources :users, only: [:create] に対応
    assert_difference('User.count') do
      post users_path, params: { user: {
        name: "Example User",
        email: "user@example.com",
        student_id: "example123",
        password: "password",
        password_confirmation: "password"
      } }
    end

    # ユーザー作成後にリダイレクトされることを確認
    assert_redirected_to root_url # 一般的にはログインしてルートURLなどにリダイレクト
  end
end
