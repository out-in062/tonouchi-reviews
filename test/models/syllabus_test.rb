require "test_helper"

class SyllabusTest < ActiveSupport::TestCase
  test "valid syllabus" do
    syllabus = Syllabus.new(code: 999, name: "有効な科目名")
    assert syllabus.valid?
  end

  test "name should be present" do
    syllabus = Syllabus.new(code: 999, name: "")
    assert_not syllabus.valid?
    # :name にエラーが含まれているかだけをチェック
    assert syllabus.errors[:name].any?
  end

  test "name should be unique" do
    # fixtureのoneを使用（"テスト科目1"）
    duplicate_syllabus = Syllabus.new(code: 999, name: syllabuses(:one).name)
    assert_not duplicate_syllabus.valid?
    # :name にエラーが含まれているかだけをチェック
    assert duplicate_syllabus.errors[:name].any?
  end

  test "name should be at least 2 characters long" do
    syllabus = Syllabus.new(code: 999, name: "あ")
    assert_not syllabus.valid?
    # :name にエラーが含まれているかだけをチェック
    assert syllabus.errors[:name].any?
  end
end
