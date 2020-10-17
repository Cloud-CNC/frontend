/**
 * @fileoverview Primary Cypress support file
 */

//Commands
import './commands';

//Terminal report
import terminalReport from 'cypress-terminal-report/src/installLogsCollector';
terminalReport();

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