/**
 * @fileoverview Login Nightwatch page object
 */

//Export
module.exports = {
  url: '/login',
  elements: {
    appContainer: '#app'
  },
  sections: {
    card: {
      selector: 'div[contains(@class, "v-card v-sheet")]',

      sections: {
        username: {
          selector: 'input[1]'
        },

        password: {
          selector: 'input[2]'
        },

        submit: {
          selector: 'button[@class="v-btn v-btn--contained v-size--default secondary"]'
        }
      }
    }
  }
};