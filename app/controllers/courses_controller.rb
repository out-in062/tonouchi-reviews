# app/controllers/courses_controller.rb
class CoursesController < ApplicationController
  def index
    @courses = Course.all

    if params[:search].present?
      search_term = "%#{params[:search]}%"
      @courses = @courses.where("name LIKE :search OR instructor LIKE :search OR code LIKE :search", search: search_term)
    end

    if params[:department].present? && params[:department] != "all"
      @courses = @courses.where(department: params[:department])
    end

    case params[:sort]
    when "rating_desc"
      # 口コミの平均評価でソート (JOINとGROUP BYが必要)
      @courses = @courses
                 .left_joins(:reviews)
                 .group("courses.id")
                 .order("AVG(reviews.rating) DESC NULLS LAST")
    when "newest"
      @courses = @courses.order(created_at: :desc)
    when "code_asc"
      @courses = @courses.order(code: :asc)
    else
      # デフォルトのソート順 (例: 新着順)
      @courses = @courses.order(created_at: :desc)
    end

    @departments = Course.distinct.pluck(:department).compact.sort
  end

  def show
    @course = Course.includes(reviews: :user).find(params[:id])
    @review = Review.new
  end
end
