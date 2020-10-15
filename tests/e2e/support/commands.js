/**
 * @fileoverview Cypress commands
 */

//Imports
import timings from '../utils/timings.js';

Cypress.Commands.add('count', selector =>
{
  const count = Cypress.$(selector).length;

  return cy.wrap(count);
});

Cypress.Commands.add('login', (username = 'Test Account', password = 'Testingpassword123!') =>
{
  cy.visit('/login');

  cy.get('[data-e2e=username]').type(username);
  cy.get('[data-e2e=password]').type(password);

  cy.get('[data-e2e=login]').click();

  cy.wait(timings.medium);

  cy.url().should('eq', 'https://127.0.0.1:8443/files');
});

Cypress.Commands.add('upload', (name, data, mime, selector) =>
{
  cy.get(selector).closest('.v-file-input').then(element =>
  {
    //Get window to instantiate correct File (https://github.com/cypress-io/cypress/issues/933)
    cy.window().then(window =>
    {
      //Create the file
      const file = new window.File([data], name, {
        type: mime
      });

      //Mock file upload
      element[0].__vue__.internalValue = file;
    });
  });
});

Cypress.Commands.add('invalid', selector =>
{
  cy.get(selector).parent().children().should('have.class', 'error--text');
});

Cypress.Commands.add('valid', selector =>
{
  cy.get(selector).parent().children().should('not.have.class', 'error--text');
});

Cypress.Commands.add('hasHeardMessage', (msg, action) =>
{
  //This will start listening for messages but won't notify us
  cy.task('addMessageListener', msg).then(listenerID =>
  {
    //Avoid a timing-based race condition by waiting before invoking the action
    cy.wait(timings.medium);

    //Perform the post-registration, message invoking action
    action();

    //This must be recursive because of Cypress' fake promises (Otherwise we'd await the task each time)
    const attempts = 4;
    const checkIfHeard = iteration =>
    {
      if (iteration < attempts)
      {
        //Wait before checking if the message has been sent
        cy.wait(timings.long);

        //Return if the message has been sent otherwise recur
        cy.task('hasHeardMessage', listenerID).then(hasHeard =>
        {
          if (!hasHeard)
          {
            checkIfHeard(iteration + 1);
          }
        });
      }
      else
      {
        const error = new Error(`Expected but failed to receive "${msg}" from the controller! (Tried ${attempts} times)`);
        error.code = 'ENOMSG';
        
        throw error;
      }
    };

    //Start the recursive function
    checkIfHeard(0);
  });
});