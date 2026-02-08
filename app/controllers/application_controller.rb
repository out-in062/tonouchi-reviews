# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  # `current_user` メソッドをビューでも使えるようにヘルパーメソッドとして定義
  helper_method :current_user

  private

  # セッションにuser_idがあれば、対応するユーザーを返す
  # なければnilを返す
  def current_user
    @current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
  end

  # ログインしていなければログインページにリダイレクトする
  def require_login
    unless current_user
      redirect_to login_path, alert: "ログインが必要です。"
    end
  end
end
