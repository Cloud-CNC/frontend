/**
 * @fileoverview NYC config
 * Source: https://github.com/vuejs/vue-cli/issues/1363#issuecomment-521692197
 */

//Export
module.exports = {
  all: true,
  include: [
    'src/**/*.{js,vue}'
  ],
  reporter: [
    'lcov'
  ],
  extension: [
    '.js',
    '.vue'
  ]
};