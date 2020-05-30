/**
 * @fileoverview Logout E2E tests
 */

describe('logout', () => 
{
  beforeEach(() =>
  {
    cy.login();
  });

  it('will logout on the same page', () =>
  {
    cy.get('[data-e2e=menu]').click();
    cy.get('[data-e2e=logout]').click();

    cy.url().should('eq', 'https://127.0.0.1:8443/login');
  });

  it('will redirect logged out clients to login page', () =>
  {
    cy.get('[data-e2e=menu]').click();
    cy.get('[data-e2e=logout]').click();
    
    cy.visit('/files');

    cy.url().should('eq', 'https://127.0.0.1:8443/login');
  });
});