/**
 * @fileoverview General E2E tests
 */

describe('general', () => 
{
  beforeEach(() =>
  {
    cy.login();
  });

  it('will invert the theme on the same page', () =>
  {
    cy.get('[data-e2e=app]').should('have.class', 'theme--dark');

    cy.get('[data-e2e="invert"]').click();

    cy.get('[data-e2e=app]').should('have.class', 'theme--light');

    cy.get('[data-e2e="invert"]').click();

    cy.get('[data-e2e=app]').should('have.class', 'theme--dark');
  });

  it('will invert the theme across reloads', () =>
  {
    cy.get('[data-e2e="invert"]').click();

    cy.reload();

    cy.get('[data-e2e=app]').should('have.class', 'theme--light');

    cy.get('[data-e2e="invert"]').click();

    cy.reload();

    cy.get('[data-e2e=app]').should('have.class', 'theme--dark');
  });

  describe('display an error message', () =>
  {
    //Create a controller and machine
    before(() =>
    {
      cy.login();

      //Create a controller
      cy.visit('/controllers');

      cy.get('[data-e2e=create]').click();

      cy.get('[data-e2e=controller-name]').type('Test Controller');

      cy.get('[data-e2e=create-controller]').click();

      cy.wait(2000);

      //Create a machine
      cy.visit('/machines');

      cy.wait(2000);

      cy.get('[data-e2e=create]').click();

      cy.get('[data-e2e=machine-name]').clear().type('Test Machine');
      cy.get('[data-e2e=machine-tags]').clear({
        force: true
      }).type('Test{enter}Generic CNC Machine{enter}', {
        force: true
      });
      cy.get('[data-e2e=machine-length]').clear().type(10);
      cy.get('[data-e2e=machine-width]').clear().type(11.1);
      cy.get('[data-e2e=machine-height]').clear().type(15);

      cy.get('[data-e2e=create-machine]').click();

      cy.wait(2000);
    });

    it('will display an error message', () =>
    {
      cy.visit('/machines');

      cy.get('[data-e2e=control-machine]').last().click({
        force: true
      });

      cy.get('[data-e2e=emergency-stop-machine]').click();

      cy.get('[data-e2e=global-error-message]').should('be.visible');

      //Dismiss the message
      cy.get('[data-e2e=dismiss-global-error-message]').click();

      cy.get('[data-e2e=global-error-message]').should('not.be.visible');
    });

    //Remove the controller and machine
    after(() =>
    {
      cy.login();

      //Remove the machine
      cy.visit('/machines');

      cy.get('[data-e2e=remove-machine]').last().click();

      cy.wait(2000);

      //Remote the controller
      cy.visit('/controllers');

      cy.get('[data-e2e=remove-controller]').last().click();

      cy.wait(2000);
    });
  });
});