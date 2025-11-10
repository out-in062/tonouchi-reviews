ActiveRecord::Schema[8.0].define(version: 2025_11_07_022831) do
  create_table "courses", force: :cascade do |t|
    t.string "code"
    t.string "name", null: false
    t.string "instructor", null: false
    t.string "department"
    t.string "semester"
    t.integer "year"
    t.integer "credits"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_courses_on_code", unique: true
  end

  create_table "review_reactions", force: :cascade do |t|
    t.string "reaction_type", null: false
    t.integer "user_id", null: false
    t.integer "review_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["review_id"], name: "index_review_reactions_on_review_id"
    t.index ["user_id", "review_id"], name: "index_review_reactions_on_user_id_and_review_id", unique: true
    t.index ["user_id"], name: "index_review_reactions_on_user_id"
  end

  create_table "reviews", force: :cascade do |t|
    t.integer "rating", null: false
    t.integer "difficulty"
    t.integer "workload"
    t.string "title", null: false
    t.text "content", null: false
    t.boolean "attendance_required"
    t.text "exam_info"
    t.text "tips"
    t.string "semester_taken"
    t.integer "year_taken"
    t.boolean "published", default: true, null: false
    t.integer "user_id", null: false
    t.integer "course_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["course_id"], name: "index_reviews_on_course_id"
    t.index ["user_id"], name: "index_reviews_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "student_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["student_id"], name: "index_users_on_student_id", unique: true
  end

  add_foreign_key "review_reactions", "reviews"
  add_foreign_key "review_reactions", "users"
  add_foreign_key "reviews", "courses"
  add_foreign_key "reviews", "users"
end
