/**
 * @fileoverview Login E2E tests
 */

//Imports
import speakeasy from 'speakeasy';
import timings from '../utils/timings.js';

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
      cy.get('[data-e2e=login]').should('be.disabled');

      cy.get('[data-e2e=username]').clear().type('Username');
      cy.get('[data-e2e=password]').clear().type('Testingpassword123!');

      cy.valid('[data-e2e=username]');
      cy.valid('[data-e2e=password]');
      cy.get('[data-e2e=login]').should('not.be.disabled');
    });

    it('will reject invalid username', () =>
    {
      cy.visit('/login');

      cy.get('[data-e2e=username]').type('Not The Test Account');
      cy.get('[data-e2e=password]').type('Testingpassword123!');

      cy.get('[data-e2e=login]').click();

      cy.get('[data-e2e=invalid-credentials]').children().eq(0).should('be.visible');
    });

    it('will reject invalid password', () =>
    {
      cy.visit('/login');

      cy.get('[data-e2e=username]').type('Test Account');
      cy.get('[data-e2e=password]').type('Notthetestingpassword123!');

      cy.get('[data-e2e=login]').click();

      cy.get('[data-e2e=invalid-credentials]').children().eq(0).should('be.visible');
    });

    it('will accept valid username and password', () =>
    {
      cy.visit('/login');

      cy.get('[data-e2e=username]').type('Test Account');
      cy.get('[data-e2e=password]').type('Testingpassword123!');

      cy.get('[data-e2e=login]').click();

      cy.url().should('eq', 'https://127.0.0.1:8443/files');
    });
  });

  describe('login with MFA', () =>
  {
    //MFA secret
    let secret;

    before(() =>
    {
      cy.login();

      //Create an MFA account
      cy.visit('/admin');

      cy.wait(timings.medium);

      cy.get('[data-e2e=create]').click();

      cy.get('[data-e2e=account-username]').type('Test Account 2');
      cy.get('[data-e2e=account-password]').type('Testingpassword123!');
      cy.get('[data-e2e=account-mfa]').check({
        force: true
      });

      cy.get('[data-e2e=upsert-account]').click();

      cy.wait(timings.medium);

      //Extract MFA secret
      cy.get('[data-e2e=account-mfa-token]').then(element =>
      {
        secret = /otpauth:\/\/totp\/Cloud%20CNC\?secret=([A-Z0-9]+)/.exec(element[0].__vue__.text)[1];
      });
    });

    it('will validate input OTP', () =>
    {
      cy.visit('/login');

      cy.get('[data-e2e=username]').type('Test Account 2');
      cy.get('[data-e2e=password]').type('Testingpassword123!');

      cy.get('[data-e2e=login]').click();

      cy.get('[data-e2e=otp]').type(123);
      cy.invalid('[data-e2e=otp]');
    });

    it('will reject invalid OTP', () =>
    {
      cy.visit('/login');

      cy.get('[data-e2e=username]').type('Test Account 2');
      cy.get('[data-e2e=password]').type('Testingpassword123!');

      cy.get('[data-e2e=login]').click();

      cy.get('[data-e2e=otp]').type(123456);

      cy.get('[data-e2e=login]').click();

      cy.get('[data-e2e=invalid-credentials]').children().eq(0).should('be.visible');
    });

    it('will accept valid OTP', () =>
    {
      cy.visit('/login');

      cy.get('[data-e2e=username]').type('Test Account 2');
      cy.get('[data-e2e=password]').type('Testingpassword123!');

      cy.wait(timings.short);

      cy.get('[data-e2e=login]').click();

      cy.wait(timings.medium);

      const otp = speakeasy.totp({
        encoding: 'base32',
        secret
      });

      cy.get('[data-e2e=otp]').type(otp);

      cy.wait(timings.short);

      cy.get('[data-e2e=login]').click();

      cy.wait(timings.medium);

      cy.url().should('eq', 'https://127.0.0.1:8443/files');
    });

    after(() =>
    {
      cy.login();

      //Remove the MFA account
      cy.visit('/admin');

      cy.get('[data-e2e=remove-account]').last().click();
      cy.get('[data-e2e=remove-account-confirm]').click();

      cy.wait(timings.medium);
    });
  });
});