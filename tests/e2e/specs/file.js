/**
 * @fileoverview Files E2E tests
 */

//Imports
import timings from '../utils/timings.js';

//Files
const gcode = 'G0 X0 Y0 Z0\nG0 X5 Y0 Z0\nG0 X5 Y5 Z0\nG0 X5 Y5 Z5\nG0 E1 X5 Y5 Z0\nG0 E2 X5 Y0 Z0\nG0 E3 X0 Y0 Z0';

describe('file', () => 
{
  before(() =>
  {
    cy.login();

    //Create a file
    cy.get('[data-e2e=create]').click();

    cy.get('[data-e2e=file-name]').clear().type('Thing');
    cy.get('[data-e2e=file-description]').clear().type('A thingy');
    cy.upload('Thing.gcode', gcode, 'text/plain', '[data-e2e=file-raw]');

    cy.get('[data-e2e=upsert-file]').click();

    cy.wait(timings.medium);
  });

  it('will display a file', () =>
  {
    cy.wait(timings.medium);

    cy.get('[data-e2e=open-file]').last().click();

    cy.url().should('match', /^https:\/\/127\.0\.0\.1:8443\/file\/[0-9a-f]{24}$/);

    cy.wait(timings.extraLong);

    cy.get('[data-e2e=file-viewer]').should('be.visible');
  });

  describe('execute a file', () =>
  {
    //The mock machine's controller's key
    let controllerKey;

    before(() =>
    {
      cy.login();

      //Create the controller and extract its key
      cy.visit('/controllers');

      cy.get('[data-e2e=create]').click();

      cy.get('[data-e2e=controller-name]').type('Test Controller');

      cy.get('[data-e2e=upsert-controller]').click();

      cy.wait(timings.medium);

      //Disable downloading the key
      cy.window().then(window =>
      {
        window.disableDownloads = true;
      });

      cy.get('[data-e2e=download-controller-key]').last().click();

      cy.wait(timings.medium);

      cy.get('[data-e2e=download-controller-key]').last().children().eq(0).children().eq(0).invoke('attr', 'href').then(href =>
      {
        return fetch(href).then(res => res.text()).then(text =>
        {
          controllerKey = /Key:\s+([A-z0-9\\/\\+=]+)/.exec(text)[1];
        });
      });

      //Create the machine
      cy.visit('/machines');

      cy.get('[data-e2e=create]').click();

      cy.get('[data-e2e=machine-name]').clear().type('Test Machine');
      cy.get('[data-e2e=machine-tags]').clear({
        force: true
      }).type('Test{enter}Generic CNC Machine{enter}', {
        force: true
      });
      cy.get('[data-e2e=machine-length]').clear().type(10);
      cy.get('[data-e2e=machine-width]').clear().type(11.1);
      cy.get('[data-e2e=machine-height]').clear().type(15);

      cy.get('[data-e2e=upsert-machine]').click();

      cy.wait(timings.medium);

      //Extract the machine's ID and controller ID
      cy.get('[data-e2e=machine-info]').then(elements =>
      {
        const element = elements[elements.length - 1];
        const parsed = /Machine ID:\s+([0-9a-f]+)\s+Controller Name:\s+.+\s+Controller ID:\s+([0-9a-f]+)/.exec(element.innerText);

        cy.task('start', {
          controllerID: parsed[2],
          controllerKey,
          machineID: parsed[1]
        });
      });
    });

    it('will execute a file', () =>
    {
      cy.visit('/files');

      cy.get('[data-e2e=open-file]').last().click();

      cy.get('[data-e2e=execute-file]').click();

      cy.get('[data-e2e=execute-file-lightbox]').parent().parent().parent().parent().next().children().eq(0).should('be.visible');

      cy.get('[data-e2e=execute-machine]').prev().should('have.text', 'Test Machine');

      cy.hasHeardMessage(`M28\n${gcode}M29\n`, () =>
      {
        cy.get('[data-e2e=confirm-execute]').click();
      });
    });

    after(() =>
    {
      cy.login();

      //Stop the mock controller
      cy.task('stop');

      //Remove the machine
      cy.visit('/machines');

      cy.get('[data-e2e=remove-machine]').last().click();
      cy.get('[data-e2e=remove-machine-confirm]').click();

      cy.wait(timings.medium);

      //Remote the controller
      cy.visit('/controllers');

      cy.get('[data-e2e=remove-controller]').last().click();
      cy.get('[data-e2e=remove-controller-confirm]').click();

      cy.wait(timings.medium);
    });
  });

  after(() =>
  {
    cy.login();

    //Remove the file
    cy.get('[data-e2e=remove-file]').last().click();
    cy.get('[data-e2e=remove-file-confirm]').click();

    cy.wait(timings.long);

    cy.visit('/trash');

    cy.get('[data-e2e=remove-file]').last().click();
    cy.get('[data-e2e=remove-file-confirm]').click();
  });
});