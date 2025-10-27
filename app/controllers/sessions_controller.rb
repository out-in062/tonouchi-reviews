class SessionsController < ApplicationController
  def new
  end

  def create
    # params[:email] -> params[:session][:email] に変更
    user = User.find_by(email: params[:session][:email].downcase)

    # params[:password] -> params[:session][:password] に変更
    if user&.authenticate(params[:session][:password])
      session[:user_id] = user.id
      redirect_to root_url, notice: "Logged in successfully."
    else
      flash.now[:alert] = "Invalid email or password"
      render :new, status: :unprocessable_entity
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_url, notice: "Logged out successfully."
  end
end
