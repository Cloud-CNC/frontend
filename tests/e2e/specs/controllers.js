/**
 * @fileoverview Controllers E2E tests
 */

describe('controllers', () =>
{
  beforeEach(() =>
  {
    cy.login();
    cy.visit('/controllers');
  });

  describe('create a controller', () =>
  {
    it('will validate input', () =>
    {
      cy.get('[data-e2e=create]').click();

      cy.get('[data-e2e=controller-name]').type('A');

      cy.invalid('[data-e2e=controller-name]');
      cy.get('[data-e2e=create-controller]').should('be.disabled');

      cy.get('[data-e2e=controller-name]').clear().type('Test Controller');

      cy.valid('[data-e2e=controller-name]');
      cy.get('[data-e2e=create-controller]').should('not.be.disabled');
    });

    it('will create a controller', () =>
    {
      //Get number of controllers before creating one
      cy.count('[data-e2e=entity-name]').then(before =>
      {
        cy.get('[data-e2e=create]').click();

        cy.get('[data-e2e=controller-name]').type('Test Controller');

        cy.get('[data-e2e=create-controller]').click();

        cy.count('[data-e2e=entity-name]').should('eq', before + 1);
      });
    });
  });

  describe('edit a controller', () =>
  {
    it('will validate input', () =>
    {
      cy.get('[data-e2e=edit-controller]').last().click();

      cy.get('[data-e2e=controller-name]').clear().type('A');

      cy.invalid('[data-e2e=controller-name]');

      cy.get('[data-e2e=controller-name]').clear().type('Test Controller [Edit]');

      cy.valid('[data-e2e=controller-name]');
    });

    it('will edit a controller', () =>
    {
      const name = 'Test Controller [Edit]';

      cy.get('[data-e2e=edit-controller]').last().click();

      cy.get('[data-e2e=controller-name]').clear().type(name).blur();

      cy.get('[data-e2e=close-controller]').click();

      cy.get('[data-e2e=entity-name]').last().contains(name);
    });
  });

  describe('remove a controller', () =>
  {
    it('will remove a controller', () =>
    {
      //Wait for page to render
      cy.get('[data-e2e=entity-name]').should('be.visible');

      //Get number of controllers before removing one
      cy.count('[data-e2e=entity-name]').then(before =>
      {
        cy.get('[data-e2e=remove-controller]').last().click();

        cy.count('[data-e2e=entity-name]').should('eq', before - 1);
      });
    });
  });
});