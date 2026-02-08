class SessionsController < ApplicationController
  def new
  end

  def create
    email = params.dig(:session, :email) || params[:email]
    password = params.dig(:session, :password) || params[:password]
    user = User.find_by(email: email&.downcase)

    if user&.authenticate(password)
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
