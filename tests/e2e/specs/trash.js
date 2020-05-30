/**
 * @fileoverview Trash E2E tests
 */

describe('trash', () => 
{
  beforeEach(() =>
  {
    cy.login();
    cy.visit('/trash');
  });

  it('will recover a file', () =>
  {
    //Visit the files page
    cy.visit('/files');

    //Get number of files before removing one
    cy.count('[data-e2e=entity-name]').then(beforeFiles =>
    {
      //Visit the files page
      cy.visit('/trash');

      //Get number of files before adding one
      cy.count('[data-e2e=entity-name]').then(beforeTrash =>
      {
        cy.get('[data-e2e=recover-file]').last().click();

        cy.count('[data-e2e=entity-name]').should('eq', beforeTrash - 1);

        //Visit the files page
        cy.visit('/files');

        cy.count('[data-e2e=entity-name]').should('eq', beforeFiles + 1);

        //Reset for next test
        cy.get('[data-e2e=remove-file]').last().click();
      });
    });


  });

  it('will remove a file (permanently)', () =>
  {
    //Get number of files before removing one
    cy.count('[data-e2e=entity-name]').then(before =>
    {
      cy.get('[data-e2e=remove-file]').last().click();

      cy.count('[data-e2e=entity-name]').should('eq', before - 1);
    });
  });
});