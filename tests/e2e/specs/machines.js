/**
 * @fileoverview Machines E2E tests
 */

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