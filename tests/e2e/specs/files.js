/**
 * @fileoverview Files E2E tests
 */

//Imports
import timings from '../utils/timings.js';

//Mock file
const raw = 'G0 X0 Y0 Z0\nG0 X5 Y0 Z0\nG0 X5 Y5 Z0\nG0 X5 Y5 Z5\nG0 E1 X5 Y5 Z0\nG0 E2 X5 Y0 Z0\nG0 E3 X0 Y0 Z0';


describe('files', () => 
{
  beforeEach(() =>
  {
    cy.login();
  });

  describe('create a file', () =>
  {
    it('will validate input', () =>
    {
      cy.get('[data-e2e=create]').click();

      cy.get('[data-e2e=file-name]').type('A');
      cy.get('[data-e2e=file-description]').type('+'.repeat(1001), {
        delay: 0
      });
      cy.upload('Benchy.x', '', 'text/plain', '[data-e2e=file-raw]');

      cy.invalid('[data-e2e=file-name]');
      cy.invalid('[data-e2e=file-description]');
      cy.invalid('[data-e2e=file-raw');
      cy.get('[data-e2e=upsert-file]').should('be.disabled');

      cy.get('[data-e2e=file-name]').clear().type('Benchy');
      cy.get('[data-e2e=file-description]').clear().type('A 3D printer torture test.');
      cy.upload('Benchy.gcode', raw, 'text/plain', '[data-e2e=file-raw]');

      cy.valid('[data-e2e=file-name]');
      cy.valid('[data-e2e=file-description]');
      cy.valid('[data-e2e=file-raw');
      cy.get('[data-e2e=upsert-file]').should('not.be.disabled');
    });

    it('will accept valid input and create a file', () =>
    {
      //Get number of files before creating one
      cy.count('[data-e2e=entity-name]').then(before =>
      {
        cy.get('[data-e2e=create]').click();

        cy.get('[data-e2e=file-name]').clear().type('Benchy');
        cy.get('[data-e2e=file-description]').clear().type('A 3D printer torture test.');
        cy.upload('Benchy.gcode', raw, 'text/plain', '[data-e2e=file-raw]');

        cy.valid('[data-e2e=upsert-file]');
        cy.get('[data-e2e=upsert-file]').click();

        cy.wait(timings.medium);

        cy.count('[data-e2e=entity-name]').should('eq', before + 1);
      });
    });
  });

  describe('edit a file', () =>
  {
    it('will hide the file uploader', () =>
    {
      cy.get('[data-e2e=edit-file]').last().click();

      cy.get('[data-e2e=file-raw]').should('not.be.visible');
    });

    it('will validate input', () =>
    {
      cy.get('[data-e2e=edit-file]').last().click();

      cy.get('[data-e2e=file-name]').clear().type('A');
      cy.get('[data-e2e=file-description]').clear().type('+'.repeat(1001), {
        delay: 0
      });

      cy.invalid('[data-e2e=file-name]');
      cy.invalid('[data-e2e=file-description]');

      cy.get('[data-e2e=file-name]').clear().type('Benchy [Edit]');
      cy.get('[data-e2e=file-description]').clear().type('A 3D printer torture test. Edit: Did absolutely nothing different, just wanted to test this.');

      cy.valid('[data-e2e=file-name]');
      cy.valid('[data-e2e=file-description]');
    });

    it('will edit a file', () =>
    {
      const name = 'Benchy [Edit]';
      const description = 'A 3D printer torture test. Edit: Did absolutely nothing different, just wanted to test this.';

      cy.get('[data-e2e=edit-file]').last().click();

      cy.get('[data-e2e=file-name]').clear().type(name);
      cy.get('[data-e2e=file-description]').clear().type(description);

      cy.get('[data-e2e=upsert-file]').click();

      cy.get('[data-e2e=close-file]').click();

      cy.wait(timings.medium);

      cy.get('[data-e2e=entity-name]').last().contains(name);
      cy.get('[data-e2e=entity-description]').last().contains(description);
    });
  });

  describe('remove a file', () =>
  {
    it('will remove a file (temporarily)', () =>
    {
      //Wait for page to render
      cy.get('[data-e2e=entity-name]').should('be.visible');

      //Get number of files before removing one
      cy.count('[data-e2e=entity-name]').then(before =>
      {
        cy.get('[data-e2e=remove-file]').last().click();

        cy.wait(timings.medium);

        cy.count('[data-e2e=entity-name]').should('eq', before - 1);
      });
    });
  });

  after(() =>
  {
    cy.login();

    //Remove the file permanently
    cy.visit('/trash');

    cy.get('[data-e2e=remove-file]').last().click();

    cy.wait(timings.medium);
  });
});