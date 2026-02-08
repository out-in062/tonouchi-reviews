require "test_helper"

class ReviewsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @course = courses(:one)
    @user = users(:one) # new アクションのテストではこのユーザーでログイン
  end

  test "should get new" do
    log_in_as(users(:two)) # newアクションのテストの前にログイン
    get new_course_review_path(@course)
    assert_response :success
  end

  test "should post create" do
    # このテストでは「まだレビューしていないユーザー」でログインする
    log_in_as(users(:two))

    assert_difference("Review.count") do
      post course_reviews_path(@course), params: { review: {
        rating: 5,
        difficulty: 1,
        workload: 1,
        title: "最高の授業",
        content: "とても勉強になりました。",
        attendance_required: false,
        exam_info: "特になし",
        tips: "予習が大事",
        semester_taken: "前期",
        year_taken: 2024
      } }
    end

    assert_redirected_to course_path(@course)
  end
end
