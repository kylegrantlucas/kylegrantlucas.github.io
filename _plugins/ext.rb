require "jekyll-assets"
require "jekyll-assets/compass"
require 'font-awesome-sass'
require "react-jsx-sprockets"

ReactJSXSprockets.configure do |config|
  config.extensions = %w( jsx )
end

