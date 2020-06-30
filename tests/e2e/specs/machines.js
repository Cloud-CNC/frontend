/**
 * @fileoverview Machines E2E tests
 */

//Imports
const IpcHelper = require('../utils/ipc');
const childProcess = require('child_process');
const path = require('path');

//The mock machine's controller's key
let controllerKey;

describe('machines', () =>
{
  //Create mock controller
  before(done =>
  {
    cy.login();
    cy.visit('/controllers');

    cy.get('[data-e2e=create]').click();

    cy.get('[data-e2e=controller-name]').type('Test Controller');

    cy.get('[data-e2e=create-controller]').click();

    //Extract the key
    cy.get('[data-e2e=download-controller-key]').invoke('attr', 'href').then(async href =>
    {
      const res = await fetch(href);
      const text = await res.text();
      controllerKey = /Key:\s+([A-z0-9\\/\\+=]+)/.exec(text)[1];

      done();
    });
  });

  beforeEach(() =>
  {
    cy.login();
    cy.visit('/machines');
  });

  describe('create a machine', () =>
  {
    it('will validate input', () =>
    {
      cy.get('[data-e2e=create]').click();

      cy.get('[data-e2e=machine-name]').type('A');
      cy.get('[data-e2e=machine-tags]').type(`${'+'.repeat(200)}{enter}`);

      cy.invalid('[data-e2e=machine-name]');
      cy.valid('[data-e2e=machine-controller]');
      cy.get('[data-e2e=machine-tags]').parent().parent().children().should('have.class', 'error--text');
      cy.valid('[data-e2e=machine-length]');
      cy.valid('[data-e2e=machine-width]');
      cy.valid('[data-e2e=machine-height]');
      cy.get('[data-e2e=create-machine]').should('be.disabled');

      cy.get('[data-e2e=machine-name]').clear().type('Test Machine');
      cy.get('[data-e2e=machine-tags]').clear().type('Test{enter}Generic CNC Machine{enter}');
      cy.get('[data-e2e=machine-length]').clear().type(10);
      cy.get('[data-e2e=machine-width]').clear().type(11.1);
      cy.get('[data-e2e=machine-height]').clear().type(15);

      cy.valid('[data-e2e=machine-name]');
      cy.valid('[data-e2e=machine-controller]');
      cy.get('[data-e2e=machine-tags]').parent().parent().children().should('not.have.class', 'error--text');
      cy.valid('[data-e2e=machine-length]');
      cy.valid('[data-e2e=machine-width]');
      cy.valid('[data-e2e=machine-height]');
      cy.get('[data-e2e=create-machine]').should('not.be.disabled');
    });

    it('will create a machine', () =>
    {
      //Get number of machines before creating one
      cy.count('[data-e2e=entity-name]').then(before =>
      {
        cy.get('[data-e2e=create]').click();

        cy.get('[data-e2e=machine-name]').clear().type('Test Machine');
        cy.get('[data-e2e=machine-tags]').clear().type('Test{enter}Generic CNC Machine{enter}');
        cy.get('[data-e2e=machine-length]').clear().type(10);
        cy.get('[data-e2e=machine-width]').clear().type(11.1);
        cy.get('[data-e2e=machine-height]').clear().type(15);

        cy.get('[data-e2e=create-machine]').click();

        cy.count('[data-e2e=entity-name]').should('eq', before + 1);
      });
    });
  });

  /*describe('control a machine', () =>
  {
    let controllerProcess;

    //Start the controller in E2E mode
    before(done =>
    {
      //Extract the existing machine's ID and controller ID
      cy.get('[data-e2e=machine-info]').then(element =>
      {
        const parsed = /Machine ID:\s+([0-9a-f]+)\s+Controller Name:\s+Local\s+Controller ID:\s+([0-9a-f]+)/.exec(element.text());

        controllerProcess = childProcess.fork(path.resolve('../controller/index.js'), null, {
          env: {
            NODE_ENV: 'development',
            E2E: 'true',
            CONTROLLER_ID: parsed[2],
            CONTROLLER_KEY: '',
            MACHINE_ID: parsed[1]
          }
        });

        done();
      });
    });

    it('will control a machine using the GUI', async () =>
    {
      //Create an IPC helper to talk to the controller
      const helper = new IpcHelper();

      cy.get('[data-e2e=emergency-stop-machine]').click();
      await helper.waitForMessage('M112\n');

      cy.get('[data-e2e=stop-machine]').click();
      await helper.waitForMessage('M0\n');

      cy.get('[data-e2e=turn-off-machine]').click();
      await helper.waitForMessage('M81\n');

      cy.get('[data-e2e=home-machine]').click();
      await helper.waitForMessage('G28\n');

      cy.get('[data-e2e=jog-machine-forward]').click();
      await helper.waitForMessage('G91\nG0 Y10\n');

      cy.get('[data-e2e=jog-machine-left]').click();
      await helper.waitForMessage('G91\nG0 X10\n');

      cy.get('[data-e2e=jog-machine-right]').click();
      await helper.waitForMessage('G91\nG0 X-10\n');

      cy.get('[data-e2e=jog-machine-backward]').click();
      await helper.waitForMessage('G91\nG0 Y-10\n');

      cy.get('[data-e2e=jog-machine-up]').click();
      await helper.waitForMessage('G91\nG0 Z10\n');

      cy.get('[data-e2e=jog-machine-down]').click();
      await helper.waitForMessage('G91\nG0 Z-10\n');
    });

    it('will control a machine using raw commands', done =>
    {

    });

    after(() =>
    {
      controllerProcess.kill();
    });
  });*/

  describe('edit a machine', () =>
  {
    it('will validate input', () =>
    {
      cy.get('[data-e2e=edit-machine]').last().click();

      cy.get('[data-e2e=machine-name]').clear().type('A');
      cy.get('[data-e2e=machine-tags]').type(`{backspace}{backspace}{backspace}${'+'.repeat(200)}{enter}`);

      cy.invalid('[data-e2e=machine-name]');
      cy.valid('[data-e2e=machine-controller]');
      cy.get('[data-e2e=machine-tags]').parent().parent().children().should('have.class', 'error--text');
      cy.valid('[data-e2e=machine-length]');
      cy.valid('[data-e2e=machine-width]');
      cy.valid('[data-e2e=machine-height]');

      cy.get('[data-e2e=machine-name]').clear().type('Test Machine [Edit]');
      cy.get('[data-e2e=machine-tags]').clear().type('Test [Edit]{enter}Generic CNC Machine{enter}');
      cy.get('[data-e2e=machine-length]').clear().type(15);
      cy.get('[data-e2e=machine-width]').clear().type(17);
      cy.get('[data-e2e=machine-height]').clear().type(0.1);

      cy.valid('[data-e2e=machine-name]');
      cy.valid('[data-e2e=machine-controller]');
      cy.get('[data-e2e=machine-tags]').parent().parent().children().should('not.have.class', 'error--text');
      cy.valid('[data-e2e=machine-length]');
      cy.valid('[data-e2e=machine-width]');
      cy.valid('[data-e2e=machine-height]');
    });

    it('will edit a machine', () =>
    {
      const name = 'Test Machine [Edit]';
      const tags = ['Test [Edit]', 'Generic CNC Machine'];

      cy.get('[data-e2e=edit-machine]').last().click();

      cy.get('[data-e2e=machine-name]').clear().type(name).blur();
      cy.get('[data-e2e=machine-tags]').clear().type(tags.join('{enter}')).blur();
      cy.get('[data-e2e=machine-length]').clear().type(15).blur();
      cy.get('[data-e2e=machine-width]').clear().type(17).blur();
      cy.get('[data-e2e=machine-height]').clear().type(0.1).blur();

      cy.get('[data-e2e=close-machine]').click();

      cy.get('[data-e2e=entity-name]').last().contains(name);
    });
  });

  describe('remove a machine', () =>
  {
    it('will remove a machine', () =>
    {
      //Wait for page to render
      cy.get('[data-e2e=entity-name]').should('be.visible');

      //Get number of machines before removing one
      cy.count('[data-e2e=entity-name]').then(before =>
      {
        cy.get('[data-e2e=remove-machine]').last().click();

        cy.count('[data-e2e=entity-name]').should('eq', before - 1);
      });
    });
  });

  after(() =>
  {
    cy.visit('/controllers');

    cy.get('[data-e2e=remove-controller]').last().click();
  });
});