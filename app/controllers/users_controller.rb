class UsersController < ApplicationController
  before_action :require_login, only: [:show]

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      session[:user_id] = @user.id
      redirect_to root_path, notice: "User was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def show
    @user = current_user
    @reviews = @user.reviews.includes(:course).order(created_at: :desc)
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :student_id)
  end

  def require_login
    unless current_user
      redirect_to login_path, alert: "ログインしてください"
    end
  end
end
