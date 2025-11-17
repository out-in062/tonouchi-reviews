# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2025_11_12_031121) do
  create_table "courses", force: :cascade do |t|
    t.string "code"
    t.datetime "created_at", null: false
    t.integer "credits"
    t.string "department"
    t.text "description"
    t.string "instructor", null: false
    t.string "name", null: false
    t.string "semester"
    t.datetime "updated_at", null: false
    t.integer "year"
    t.index ["code"], name: "index_courses_on_code", unique: true
  end

  create_table "review_reactions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "reaction_type", null: false
    t.integer "review_id", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["review_id"], name: "index_review_reactions_on_review_id"
    t.index ["user_id", "review_id"], name: "index_review_reactions_on_user_id_and_review_id", unique: true
    t.index ["user_id"], name: "index_review_reactions_on_user_id"
  end

  create_table "reviews", force: :cascade do |t|
    t.boolean "attendance_required"
    t.text "content", null: false
    t.integer "course_id", null: false
    t.datetime "created_at", null: false
    t.integer "difficulty"
    t.text "exam_info"
    t.boolean "published", default: true, null: false
    t.integer "rating", null: false
    t.string "semester_taken"
    t.text "tips"
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.integer "workload"
    t.integer "year_taken"
    t.index ["course_id"], name: "index_reviews_on_course_id"
    t.index ["user_id"], name: "index_reviews_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "name", null: false
    t.string "password_digest", null: false
    t.string "student_id"
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["student_id"], name: "index_users_on_student_id", unique: true
  end

  add_foreign_key "review_reactions", "reviews"
  add_foreign_key "review_reactions", "users"
  add_foreign_key "reviews", "courses"
  add_foreign_key "reviews", "users"
end
