require "test_helper"

class SessionsControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    get login_path
    assert_response :success
  end

  test "should post create" do
    user = users(:one)
    post login_path, params: { session: { email: user.email, password: 'password' } }
    # ログイン後にルートURLにリダイレクトされることを検証
    assert_redirected_to root_url
  end

  test "should delete destroy" do
    # 最初にログインしておく
    log_in_as(users(:one))
    # ログアウトする
    delete logout_path
    # ログアウト後にルートURLにリダイレクトされることを検証
    assert_redirected_to root_url
  end
end
