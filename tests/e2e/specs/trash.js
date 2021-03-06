/**
 * @fileoverview Trash E2E tests
 */

//Imports
import timings from '../utils/timings.js';

describe('trash', () => 
{
  beforeEach(() =>
  {
    cy.login();
    cy.visit('/trash');
  });

  before(() =>
  {
    cy.login();

    //Create a file
    cy.get('[data-e2e=create]').click();

    cy.get('[data-e2e=file-name]').clear().type('Cube');
    cy.get('[data-e2e=file-description]').clear().type('A 3D printer torture test.');
    cy.upload('Cube.gcode', 'G0 X0 Y0 Z0\nG0 X5 Y0 Z0\nG0 X5 Y5 Z0\nG0 X5 Y5 Z5\nG0 E1 X5 Y5 Z0\nG0 E2 X5 Y0 Z0\nG0 E3 X0 Y0 Z0', 'text/plain', '[data-e2e=file-raw]');

    cy.valid('[data-e2e=upsert-file]');
    cy.get('[data-e2e=upsert-file]').click();

    cy.wait(timings.medium);

    cy.get('[data-e2e=remove-file]').last().click();
    cy.get('[data-e2e=remove-file-confirm]').click();

    cy.wait(timings.medium);
  });

  it('will recover a file', () =>
  {
    //Visit the files page
    cy.visit('/files');

    //Get number of files before removing one
    cy.count('[data-e2e=entity-name]').then(beforeFiles =>
    {
      //Visit the files page
      cy.visit('/trash');

      //Get number of files before adding one
      cy.count('[data-e2e=entity-name]').then(beforeTrash =>
      {
        cy.get('[data-e2e=recover-file]').last().click();

        cy.wait(timings.medium);

        cy.count('[data-e2e=entity-name]').should('eq', beforeTrash - 1);

        //Visit the files page
        cy.visit('/files');

        cy.wait(timings.medium);

        cy.count('[data-e2e=entity-name]').should('eq', beforeFiles + 1);

        //Reset for next test
        cy.get('[data-e2e=remove-file]').last().click();
        cy.get('[data-e2e=remove-file-confirm]').click();

        cy.wait(timings.medium);
      });
    });
  });

  it('will remove a file (permanently)', () =>
  {
    //Get number of files before removing one
    cy.count('[data-e2e=entity-name]').then(before =>
    {
      cy.get('[data-e2e=remove-file]').last().click();
      cy.get('[data-e2e=remove-file-confirm]').click();

      cy.wait(timings.medium);

      cy.count('[data-e2e=entity-name]').should('eq', before - 1);
    });
  });
});