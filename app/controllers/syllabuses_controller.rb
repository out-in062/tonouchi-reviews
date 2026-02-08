class SyllabusesController < ApplicationController
  def index
    @courses = Course.all
    @courses = @courses.where("faculty LIKE ?", "%#{params[:faculty]}%") if params[:faculty].present?
    @courses = @courses.where("department LIKE ?", "%#{params[:department]}%") if params[:department].present?
    @courses = @courses.where(day_of_week: params[:day_of_week]) if params[:day_of_week].present?
    @courses = @courses.where(time_slot: params[:time_slot]) if params[:time_slot].present?
  end
end
