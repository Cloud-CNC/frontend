/**
 * @fileoverview Admin E2E tests
 */

describe('admin', () => 
{
  beforeEach(() =>
  {
    cy.login();
    cy.visit('/admin');
  });

  describe('create an account', () =>
  {
    it('will validate input', () =>
    {
      cy.get('[data-e2e=create]').click();

      cy.get('[data-e2e=account-username]').type('U');
      cy.get('[data-e2e=account-password]').type('Password');

      cy.invalid('[data-e2e=account-username]');
      cy.invalid('[data-e2e=account-password]');
      cy.get('[data-e2e=create-account]').should('be.disabled');

      cy.get('[data-e2e=account-username]').clear().type('Username');
      cy.get('[data-e2e=account-password]').clear().type('Testingpassword123!');

      cy.valid('[data-e2e=account-username]');
      cy.valid('[data-e2e=account-password]');
      cy.get('[data-e2e=create-account]').should('not.be.disabled');
    });

    it('will accept valid input and create an account without MFA', () =>
    {
      //Get number of accounts before creating one
      cy.count('[data-e2e=entity-name]').then(before =>
      {
        cy.get('[data-e2e=create]').click();

        cy.get('[data-e2e=account-username]').type('Test Account 3');
        cy.get('[data-e2e=account-password]').type('Testingpassword123!');

        cy.get('[data-e2e=create-account]').click();

        cy.get('[data-e2e=account-username]').should('not.be.visible');
        cy.get('[data-e2e=account-mfa-token]').should('not.be.visible');

        cy.count('[data-e2e=entity-name]').should('eq', before + 1);
      });
    });

    it('will accept valid input and create an account with MFA', () =>
    {
      //Get number of accounts before creating one
      cy.count('[data-e2e=entity-name]').then(before =>
      {
        cy.get('[data-e2e=create]').click();

        cy.get('[data-e2e=account-username]').type('Test Account 4');
        cy.get('[data-e2e=account-password]').type('Testingpassword123!');
        cy.get('[data-e2e=account-mfa]').check({
          force: true
        });

        cy.get('[data-e2e=create-account]').click();

        cy.get('[data-e2e=account-username]').should('not.be.visible');
        cy.get('[data-e2e=account-mfa-token]').should('be.visible');

        cy.get('[data-e2e=close-account-mfa-token]').click();

        cy.wait(1000);

        cy.count('[data-e2e=entity-name]').should('eq', before + 1);
      });
    });
  });

  describe('impersonate an account', () =>
  {
    it('will impersonate an account', () =>
    {
      //Visit the account page
      cy.visit('/account/own');

      //Wait for page to render
      cy.get('[data-e2e=account-username]').should('not.have.value', '');

      //Get the account username
      cy.get('[data-e2e=account-username]').invoke('val').then(before =>
      {
        cy.visit('/admin');

        //Impersonate the second account
        cy.get('[data-e2e=impersonate-account]').eq(1).click();

        //Visit the account page
        cy.visit('/account/own');

        cy.get('[data-e2e=account-username]').invoke('val').should('not.eq', before);
      });
    });

    it('will stop impersonating an account', () =>
    {
      //Visit the account page
      cy.visit('/account/own');

      //Wait for page to render
      cy.get('[data-e2e=account-username]').should('not.have.value', '');

      //Get the account username
      cy.get('[data-e2e=account-username]').invoke('val').then(before =>
      {
        cy.visit('/admin');

        //Impersonate the second account
        cy.get('[data-e2e=impersonate-account]').eq(1).click();

        //Stop impersonating the second account
        cy.get('[data-e2e=stop-impersonating]').click();

        //Visit the account page
        cy.visit('/account/own');

        cy.get('[data-e2e=account-username]').invoke('val').should('eq', before);
      });
    });
  });

  describe('edit an account', () =>
  {
    it('will validate input', () =>
    {
      cy.get('[data-e2e=edit-account]').last().click();

      cy.get('[data-e2e=account-username]').clear().type('U');
      cy.get('[data-e2e=account-password]').clear().type('Password');

      cy.invalid('[data-e2e=account-username]');
      cy.invalid('[data-e2e=account-password]');

      cy.get('[data-e2e=account-username]').clear().type('Username');
      cy.get('[data-e2e=account-password]').clear().type('Testingpassword123!');

      cy.valid('[data-e2e=account-username]');
      cy.valid('[data-e2e=account-password]');
    });

    it('will edit an account', () =>
    {
      const username = 'Test Account [Edit]';
      const password = 'Abcdef123456!';

      cy.get('[data-e2e=edit-account]').last().click();

      cy.get('[data-e2e=account-username]').clear().type(username).blur();
      cy.get('[data-e2e=account-password]').clear().type(password).blur();

      cy.get('[data-e2e=close-account]').click();

      cy.wait(1000);

      cy.get('[data-e2e=entity-name]').last().contains(username);
    });
  });

  describe('remove an account', () =>
  {
    it('will remove an account', () =>
    {
      //Wait for page to render
      cy.get('[data-e2e=entity-name]').should('be.visible');

      //Get number of accounts before removing one
      cy.count('[data-e2e=entity-name]').then(before =>
      {
        cy.get('[data-e2e=remove-account]').last().click();
        cy.get('[data-e2e=remove-account]').last().click();

        cy.wait(1000);

        cy.count('[data-e2e=entity-name]').should('eq', before - 2);
      });
    });
  });
});