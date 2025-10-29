# app/controllers/reviews_controller.rb
class ReviewsController < ApplicationController
  before_action :require_login
  before_action :set_course

  def new
    @review = @course.reviews.new
  end

  def create
    @review = @course.reviews.new(review_params)
    @review.user = current_user
    if @review.save
      redirect_to course_path(@course), notice: "Review was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  private

  def set_course
    @course = Course.find(params[:course_id])
  end

  def review_params
    params.require(:review).permit(:rating, :difficulty, :workload, :title, :content, :attendance_required, :exam_info, :tips, :semester_taken, :year_taken)
  end
end
