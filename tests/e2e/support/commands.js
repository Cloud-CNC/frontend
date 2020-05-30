// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('count', selector =>
{
  const count = Cypress.$(selector).length;

  return cy.wrap(count);
});

Cypress.Commands.add('login', (username = 'Test Account', password = 'Testingpassword123!') =>
{
  cy.visit('/login');

  cy.get('[data-e2e=username]').type(username);
  cy.get('[data-e2e=password]').type(password);

  cy.get('[data-e2e=login]').click();

  cy.url().should('eq', 'https://127.0.0.1:8443/files');
});

Cypress.Commands.add('upload', (name, data, mime, selector) =>
{
  cy.get(selector).closest('.v-file-input').then(element =>
  {
    //Get window to instantiate correct File (https://github.com/cypress-io/cypress/issues/933)
    cy.window().then(window =>
    {
      //Get the data as bytes
      const bytes = new TextEncoder('utf-8').encode(data);

      //Create the file
      const file = new window.File([bytes], name, {
        type: mime
      });

      //Mock file upload
      element[0].__vue__.internalValue = file;
    });
  });
});

Cypress.Commands.add('invalid', selector =>
{
  cy.get(selector).parent().children().should('have.class', 'error--text');
});

Cypress.Commands.add('valid', selector =>
{
  cy.get(selector).parent().children().should('not.have.class', 'error--text');
});