/**
 * @fileoverview Login page tests
 */

//Export
module.exports = {
  beforeEach: browser => browser.init(),

  'logs in': browser =>
  {
    const login = browser.page.login();
    login.waitForElementVisible('@appContainer');

    const card = login.section.card;
    console.log(card.sections);
    card.expect.section('@submit').to.be.present;
    card.expect.section('@submit').to.be.visible;
  }
};