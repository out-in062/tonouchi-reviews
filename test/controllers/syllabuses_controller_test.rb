require "test_helper"

class SyllabusesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @syllabus = syllabuses(:one)
  end

  test "should get index" do
    get syllabuses_url
    assert_response :success
  end

  test "should get new" do
    get new_syllabus_url
    assert_response :success
  end

  test "should create syllabus" do
    assert_difference("Syllabus.count") do
      post syllabuses_url, params: { syllabus: { code: 999, name: "新規作成テスト科目" } }
    end

    assert_redirected_to syllabus_url(Syllabus.last)
  end

  test "should not create syllabus with invalid name" do
    assert_no_difference("Syllabus.count") do
      post syllabuses_url, params: { syllabus: { code: 999, name: "" } }
    end
    # バリデーションエラーの場合、newテンプレートが再表示される
    assert_response :unprocessable_entity
  end

  test "should not create syllabus with duplicate name" do
    assert_no_difference("Syllabus.count") do
      post syllabuses_url, params: { syllabus: { code: 999, name: @syllabus.name } }
    end
    assert_response :unprocessable_entity
  end

  test "should show syllabus" do
    get syllabus_url(@syllabus)
    assert_response :success
  end

  test "should get edit" do
    get edit_syllabus_url(@syllabus)
    assert_response :success
  end

  test "should update syllabus" do
    patch syllabus_url(@syllabus), params: { syllabus: { code: @syllabus.code, name: @syllabus.name } }
    assert_redirected_to syllabus_url(@syllabus)
  end

  test "should destroy syllabus" do
    assert_difference("Syllabus.count", -1) do
      delete syllabus_url(@syllabus)
    end

    assert_redirected_to syllabuses_url
  end
end
