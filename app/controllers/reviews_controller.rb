# app/controllers/reviews_controller.rb
class ReviewsController < ApplicationController
  before_action :require_login, except: [:show] # Show action does not require login
  before_action :set_course, only: [:new, :create]
  before_action :set_review, only: [:show, :edit, :update, :destroy]
  before_action :require_author, only: [:edit, :update, :destroy]

  def new
    if @course.reviews.exists?(user: current_user)
      redirect_to @course, alert: "You have already reviewed this course."
    else
      @review = @course.reviews.new
    end
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

  def show
    # @review is set by set_review before_action
  end

  def edit
    # @review is set by set_review before_action
  end

  def update
    if @review.update(review_params)
      redirect_to @review.course, notice: "Review was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @review.destroy
    redirect_to @review.course, notice: "Review was successfully destroyed."
  end

  private

  def set_course
    @course = Course.find(params[:course_id])
  end

  def set_review
    @review = Review.includes(:user, :course).find(params[:id])
  end

  def require_author
    unless current_user == @review.user
      redirect_to @review.course, alert: "You are not authorized to perform this action."
    end
  end

  def review_params
    params.require(:review).permit(:rating, :difficulty, :workload, :title, :content, :attendance_required, :exam_info, :tips, :semester_taken, :year_taken)
  end
end
