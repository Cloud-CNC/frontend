/**
 * @fileoverview Files E2E tests
 */

//Imports
const IpcHelper = require('../utils/ipc');
const {expect} = require('chai');

describe('file', () => 
{
  it('will display a file', () =>
  {
    cy.get('[data-e2e=open-file]').first().click();

    cy.url().should('match', /^https:\/\/127\.0\.0\.1:8443\/file\/[0-9a-f]{24}$/);

    cy.get('[data-e2e=file-viewer]').should('be.visible');
  });

  it('will execute a file', () =>
  {
    //Create an IPC helper to talk to the controller
    const helper = new IpcHelper();

    helper.on('message', msg =>
    {
      expect(msg).to.equal('');

      helper.close();
    });
  });
});