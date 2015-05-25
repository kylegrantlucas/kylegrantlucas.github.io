require "jekyll-assets"
require "jekyll-assets/compass"
require "react-jsx-sprockets"

ReactJSXSprockets.configure do |config|
  config.extensions = %w( jsx )
end

