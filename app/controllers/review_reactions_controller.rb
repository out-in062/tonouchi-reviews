# app/controllers/review_reactions_controller.rb
class ReviewReactionsController < ApplicationController
  before_action :require_login
  before_action :set_review

  def create
    @reaction = @review.review_reactions.find_or_initialize_by(user: current_user)
    if @reaction.update(reaction_params)
      redirect_back fallback_location: @review, notice: "Reaction saved."
    else
      redirect_back fallback_location: @review, alert: "Failed to save reaction."
    end
  end

  def destroy
    @reaction = @review.review_reactions.find_by(user: current_user)
    if @reaction
      @reaction.destroy
      redirect_back fallback_location: @review, notice: "Reaction removed."
    else
      redirect_back fallback_location: @review, alert: "You have not reacted to this review."
    end
  end

  private

  def set_review
    @review = Review.find(params[:review_id])
  end

  def reaction_params
    params.require(:review_reaction).permit(:reaction_type)
  end
end
