const { fortawesomeBrandsPlugin, } = require('@vidhill/fortawesome-brands-11ty-shortcode');
const { fortawesomeFreeRegularPlugin, } = require('@vidhill/fortawesome-free-regular-11ty-shortcode');
const emojiPlugin = require("eleventy-plugin-emoji");
const CleanCSS = require("clean-css");
module.exports = function(config) {
    config.addPassthroughCopy({ public: './' })
    
    config.addPlugin(fortawesomeBrandsPlugin);
    config.addPlugin(fortawesomeFreeRegularPlugin);
    config.addPlugin(emojiPlugin);

    config.addFilter("cssmin", function(code) {
      return new CleanCSS({}).minify(code).styles;
    });
    
    config.setBrowserSyncConfig({
      files: ['dist/**/*'],
    })
  
    return {
      templateFormats: ['md', 'njk'],
      dir: {
        input: 'src',
        output: '_site',
        layouts: "_layouts"
      }
    }
  }