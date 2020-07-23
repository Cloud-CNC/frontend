/**
 * @fileoverview Primary Cypress support file
 */

//Commands
import './commands';

//Code coverage
import '@cypress/code-coverage/support';

//Test account
before(() =>
{
  cy.task('create');
});

after(() =>
{
  cy.task('remove');
});