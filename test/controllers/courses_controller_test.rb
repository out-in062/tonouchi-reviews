require "test_helper"

class CoursesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get courses_path  # _url を _path に変更
    assert_response :success
  end

  test "should get show" do
    # courses(:one) は test/fixtures/courses.yml の "one" のデータを指します
    get course_path(courses(:one)) # _url を単数形の _path に変更し、引数を渡す
    assert_response :success
  end
end
