/**
 * @fileoverview Files E2E tests
 */

//Imports
import timings from '../utils/timings.js';

//File
let stl;

describe('file', () => 
{
  before(() =>
  {
    //Load the files
    cy.task('readBinary', './tests/e2e/fixtures/cube.stl').then(() =>
    {
      //Sanity checking (Always a bad day when you have to do this)
      throw new Error('Cypress better error out!!!');

      /*console.log(`STL Raw: ${file.length > 100 ? file.substring(0, 100) : file}`);

      //Convert to ArrayBuffer
      stl = new Uint8Array(JSON.parse(file)).buffer;

      console.log(`STL ArrayBuffer: ${stl}`);*/
    });
  });

  before(() =>
  {
    cy.login();

    //Create a file
    cy.get('[data-e2e=create]').click();

    cy.get('[data-e2e=file-name]').clear().type('Thing');
    cy.get('[data-e2e=file-description]').clear().type('A thingy');
    cy.upload('Cube.stl', stl, 'model/stl', '[data-e2e=file-raw]');

    cy.get('[data-e2e=upsert-file]').click();

    cy.wait(timings.medium);
  });

  it('will slice a file and redirect', () =>
  {
    cy.login();

    cy.get('[data-e2e=open-file]').last().click();

    //Ger previous URL
    cy.url().then(previousURL =>
    {
      cy.get('[data-e2e=slice-file]').click();

      cy.wait(timings.extraLong);

      cy.get('[data-e2e=save-file-name]').type('Benchy GCODE');

      cy.get('[data-e2e=save-file-description]').type('A Benchy sliced via Cura WASM');

      cy.get('[data-e2e=save-file]').click();

      cy.url().should('match', /^https:\/\/127\.0\.0\.1:8443\/file\/[0-9a-f]{24}$/);
      cy.url().should('not.equal', previousURL);
    });
  });

  after(() =>
  {
    cy.visit('/files');

    //Remove the files
    cy.get('[data-e2e=remove-file]').last().click();
    cy.wait(timings.medium);
    cy.get('[data-e2e=remove-file-confirm]').click();

    cy.wait(timings.short);

    cy.get('[data-e2e=remove-file]').last().click();
    cy.wait(timings.medium);
    cy.get('[data-e2e=remove-file-confirm]').click();

    cy.wait(timings.long);

    cy.visit('/trash');

    cy.get('[data-e2e=remove-file]').last().click();
    cy.wait(timings.medium);
    cy.get('[data-e2e=remove-file-confirm]').click();

    cy.wait(timings.short);

    cy.get('[data-e2e=remove-file]').last().click();
    cy.wait(timings.medium);
    cy.get('[data-e2e=remove-file-confirm]').click();
  });
});