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
});