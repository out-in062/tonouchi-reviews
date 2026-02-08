# app/controllers/courses_controller.rb
class CoursesController < ApplicationController
  def index
    @courses = Course.all
  end

  def show
    @course = Course.includes(reviews: :user).find(params[:id])
    @review = Review.new
  end
end
