require "test_helper"

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  # ブラウザが利用できない環境では rack_test を使用
  driven_by :rack_test
end
