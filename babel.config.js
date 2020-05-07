/**
 * @fileoverview Babel config
 */

//Export
module.exports = {
  env: {
    test: {
      plugins: [
        [
          'istanbul', {
            useInlineSourceMaps: false
          }
        ]
      ]
    }
  },
  presets: [
    '@vue/cli-plugin-babel/preset'
  ]
};
