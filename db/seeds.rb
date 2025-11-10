10.times do |i|
  Course.find_or_create_by!(
    code: "C#{i}",
    name: "Course #{i}",
    instructor: "Instructor #{i}",
    department: "Department #{i}",
    semester: "Semester #{i}",
    year: 2025,
    credits: 2,
    description: "This is course #{i}."
  )
end
