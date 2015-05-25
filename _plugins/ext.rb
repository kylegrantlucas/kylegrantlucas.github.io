require "jekyll-assets"
require "jekyll-assets/compass"
require "react-jsx-sprockets"
require 'octopress-gist'

ReactJSXSprockets.configure do |config|
  config.extensions = %w( jsx )
end

