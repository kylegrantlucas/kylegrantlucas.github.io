require 'jemoji'

module Jekyll
  module EmojiFilter
    def emojify(content)
      return false if !content

      return Emoji.new.filter.emoji_image_filter(content)
    end

  end
end

Liquid::Template.register_filter(Jekyll::EmojiFilter)