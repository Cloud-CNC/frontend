/**
 * @fileoverview Machines E2E tests
 */

const {expect} = require('chai');

//The mock machine's controller's key
let controllerKey;

describe('machines', () =>
{
  //Create mock controller
  before(() =>
  {
    cy.login();
    cy.visit('/controllers');

    cy.get('[data-e2e=create]').click();

    cy.get('[data-e2e=controller-name]').type('Test Controller');

    cy.get('[data-e2e=create-controller]').click();

    cy.wait(1000);
  });

  //Extract the key
  before(() =>
  {
    cy.login();
    cy.visit('/controllers');

    cy.get('[data-e2e=download-controller-key]').last().invoke('attr', 'href').then(async href =>
    {
      const res = await fetch(href);
      const text = await res.text();
      controllerKey = /Key:\s+([A-z0-9\\/\\+=]+)/.exec(text)[1];
    });
  });

  beforeEach(() =>
  {
    cy.login();
    cy.visit('/machines');
    cy.wait(1000);
  });

  describe('create a machine', () =>
  {
    it('will validate input', () =>
    {
      cy.get('[data-e2e=create]').click();

      cy.get('[data-e2e=machine-name]').type('A');
      cy.get('[data-e2e=machine-tags]').type(`${'+'.repeat(200)}{enter}`, {
        force: true
      });

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
        cy.get('[data-e2e=machine-tags]').clear({
          force: true
        }).type('Test{enter}Generic CNC Machine{enter}', {
          force: true
        });
        cy.get('[data-e2e=machine-length]').clear().type(10);
        cy.get('[data-e2e=machine-width]').clear().type(11.1);
        cy.get('[data-e2e=machine-height]').clear().type(15);

        cy.get('[data-e2e=create-machine]').click();

        cy.wait(1000);
        cy.count('[data-e2e=entity-name]').should('eq', before + 1);
      });
    });
  });

  describe('control a machine', () =>
  {
    before(() =>
    {
      //Extract the machine's ID and controller ID
      cy.get('[data-e2e=machine-info]').then(elements =>
      {
        const element = elements[elements.length - 1];
        const parsed = /Machine ID:\s+([0-9a-f]+)\s+Controller Name:\s+.+\s+Controller ID:\s+([0-9a-f]+)/.exec(element.innerText);

        //Start the controller in E2E mode
        cy.task('start', {
          controllerID: parsed[2],
          controllerKey,
          machineID: parsed[1]
        });
      });
    });

    /**
     * Because this test suite is extremely important for safety reasons,
     * we're going to make sure that the test works by awaiting for a command
     * that will never be sent by the controller
     */
    it('validate the test code', done =>
    {
      //This will cause the test to pass on an error (It should error)
      cy.on('fail', error =>
      {
        expect(error.code).to.equal('ENOMSG');

        done();

        //Prevent failing the test
        return false;
      });

      cy.get('[data-e2e=control-machine]').last().click({
        force: true
      });
      cy.get('[data-e2e=machine-controller]').next().should('be.visible');

      cy.hasHeardMessage('[INVALID]', () =>
      {
        cy.get('[data-e2e=emergency-stop-machine]').click();
      });
    });

    it('will control a machine via buttons', () =>
    {
      cy.get('[data-e2e=control-machine]').last().click({
        force: true
      });
      cy.get('[data-e2e=machine-controller]').next().should('be.visible');

      cy.hasHeardMessage('M112\n', () =>
      {
        cy.get('[data-e2e=emergency-stop-machine]').click();
      });

      cy.hasHeardMessage('M0\n', () =>
      {
        cy.get('[data-e2e=stop-machine]').click();
      });

      cy.hasHeardMessage('M81\n', () =>
      {
        cy.get('[data-e2e=turn-off-machine]').click();
      });

      cy.hasHeardMessage('G28\n', () =>
      {
        cy.get('[data-e2e=home-machine]').click();
      });

      cy.hasHeardMessage('G91\nG0 Y10\n', () =>
      {
        cy.get('[data-e2e=jog-machine-forward]').click();
      });

      cy.hasHeardMessage('G91\nG0 X10\n', () =>
      {
        cy.get('[data-e2e=jog-machine-left]').click();
      });

      cy.hasHeardMessage('G91\nG0 X-10\n', () =>
      {
        cy.get('[data-e2e=jog-machine-right]').click();
      });

      cy.hasHeardMessage('G91\nG0 Y-10\n', () =>
      {
        cy.get('[data-e2e=jog-machine-backward]').click();
      });

      cy.hasHeardMessage('G91\nG0 Z10\n', () =>
      {
        cy.get('[data-e2e=jog-machine-up]').click();
      });

      cy.hasHeardMessage('G91\nG0 Z-10\n', () =>
      {
        cy.get('[data-e2e=jog-machine-down]').click();
      });
    });

    it('will control a machine via raw commands', () =>
    {
      cy.get('[data-e2e=control-machine]').last().click({
        force: true
      });
      cy.get('[data-e2e=machine-controller]').next().should('be.visible');

      const command = '[RAW COMMAND]';
      cy.hasHeardMessage(`${command}\n`, () =>
      {
        cy.get('[data-e2e=machine-command]').type(command);
        cy.get('[data-e2e=send-machine-command]').click();
      });
    });

    after(() =>
    {
      //Stop the controller
      cy.task('stop');
    });
  });

  describe('edit a machine', () =>
  {
    it('will validate input', () =>
    {
      cy.get('[data-e2e=edit-machine]').last().click();

      cy.get('[data-e2e=machine-name]').clear().type('A');
      cy.get('[data-e2e=machine-tags]').type(`{backspace}{backspace}{backspace}${'+'.repeat(200)}{enter}`, {
        force: true
      });

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
      cy.get('[data-e2e=machine-tags]').clear({
        force: true
      }).type(tags.join('{enter}')).blur();
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
        cy.wait(1000);

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