/**
 * @fileoverview Own account E2E tests
 */

//Imports
import timings from '../utils/timings.js';

describe('account', () =>
{
  describe('edit own account', () =>
  {
    const username = 'Test Account 2';
    const password = 'Oldtestingpassword123!';

    //Create a new test account
    before(() =>
    {
      cy.login();
      cy.visit('/admin');

      cy.wait(timings.long);

      cy.get('[data-e2e=create]').click();

      cy.get('[data-e2e=account-username]').type(username);
      cy.get('[data-e2e=account-password]').type(password);
      cy.get('[data-e2e=upsert-account]').click();

      cy.wait(timings.medium);
    });

    it('will edit own account', () =>
    {
      cy.login(username, password);
      cy.visit('/account/own');

      cy.get('[data-e2e=account-username]').clear().type('Test Account [Edit]').blur();
      cy.get('[data-e2e=account-password]').clear().type('Newtestingpassword123!').blur();
      cy.get('[data-e2e=account-mfa]').check({
        force: true
      });
      cy.get('[data-e2e=account-role]').parent().parent().click();
      cy.get('[role=listbox]').children().eq(1).click();

      cy.wait(timings.short);

      cy.get('[data-e2e=update-account]').click();

      cy.wait(timings.medium);

      cy.get('[data-e2e=account-mfa-token]').should('be.visible');
      cy.get('[data-e2e=close-account-mfa-token]').click();

      cy.reload();

      cy.get('[data-e2e=account-username]').should('have.value', 'Test Account [Edit]');
      cy.get('[data-e2e=account-password]').should('have.value', '');
      cy.get('[data-e2e=account-mfa]').should('be.checked');
      cy.get('[data-e2e=account-role]').parent().should('have.text', 'User');
    });

    //Remove the test account
    after(() =>
    {
      cy.login();
      cy.visit('/admin');

      cy.get('[data-e2e=remove-account]').last().click();
      cy.get('[data-e2e=remove-account-confirm]').click();
    });
  });
});