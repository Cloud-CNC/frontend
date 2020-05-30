/**
 * @fileoverview Login E2E tests
 */

//Imports
import speakeasy from 'speakeasy';

describe('login', () => 
{
  describe('login without MFA', () =>
  {
    it('will validate username and password', () =>
    {
      cy.visit('/login');

      cy.get('[data-e2e=username]').type('U');
      cy.get('[data-e2e=password]').type('Password');

      cy.invalid('[data-e2e=username]');
      cy.invalid('[data-e2e=password]');
      cy.get('[data-e2e=login').should('be.disabled');

      cy.get('[data-e2e=username]').clear().type('Username');
      cy.get('[data-e2e=password]').clear().type('Testingpassword123!');

      cy.valid('[data-e2e=username]');
      cy.valid('[data-e2e=password]');
      cy.get('[data-e2e=login').should('not.be.disabled');
    });

    it('will reject invalid username', () =>
    {
      cy.visit('/login');

      cy.get('[data-e2e=username]').type('Not The Test Account');
      cy.get('[data-e2e=password]').type('Testingpassword123!');

      cy.get('[data-e2e=login]').click();

      cy.get('[data-e2e=invalid-credentials').should('be.visible');
    });

    it('will reject invalid password', () =>
    {
      cy.visit('/login');

      cy.get('[data-e2e=username]').type('Test Account');
      cy.get('[data-e2e=password]').type('Notthetestingpassword123!');

      cy.get('[data-e2e=login]').click();

      cy.get('[data-e2e=invalid-credentials').should('be.visible');
    });

    it('will accept valid username and password', () =>
    {
      cy.visit('/login');

      cy.get('[data-e2e=username]').type('Test Account');
      cy.get('[data-e2e=password]').type('Testingpassword123!');

      cy.get('[data-e2e=login]').click();

      cy.get('[data-e2e=invalid-credentials').should('not.be.visible');
      cy.url().should('eq', 'https://127.0.0.1:8443/files');
    });
  });

  describe('login with MFA', () =>
  {
    it('will validate input OTP', () =>
    {
      cy.visit('/login');

      cy.get('[data-e2e=username]').type('Test Account 2');
      cy.get('[data-e2e=password]').type('Testingpassword123!');

      cy.get('[data-e2e=login]').click();

      cy.get('[data-e2e=otp').type(123);
      cy.invalid('[data-e2e=otp]');
    });

    it('will reject invalid OTP', () =>
    {
      cy.visit('/login');

      cy.get('[data-e2e=username]').type('Test Account 2');
      cy.get('[data-e2e=password]').type('Testingpassword123!');

      cy.get('[data-e2e=login]').click();

      cy.get('[data-e2e=otp').type(123456);

      cy.get('[data-e2e=login]').click();

      cy.get('[data-e2e=invalid-credentials').should('be.visible');
    });

    it('will accept valid OTP', () =>
    {
      cy.visit('/login');

      cy.get('[data-e2e=username]').type('Test Account 2');
      cy.get('[data-e2e=password]').type('Testingpassword123!');

      cy.get('[data-e2e=login]').click();

      const otp = speakeasy.totp({
        encoding: 'base32',
        secret: 'KRRVI3TYIRZFIRDQLB3FCMZTOU3UY4C2GJAFMVS2KRFSSQKNGJTTSUJ6KR3DMNSKH4WGOP3EIY7GQZ2VEUVCUL3GGA7V2QZ2LNKHMRQ'
      });

      cy.get('[data-e2e=otp').type(otp);

      cy.get('[data-e2e=login]').click();

      cy.get('[data-e2e=invalid-credentials').should('not.be.visible');
      cy.url().should('eq', 'https://127.0.0.1:8443/files');
    });
  });
});