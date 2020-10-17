/* eslint-disable arrow-body-style */
// https://docs.cypress.io/guides/guides/plugins-guide.html

// if you need a custom webpack configuration you can uncomment the following import
// and then use the `file:preprocessor` event
// as explained in the cypress docs
// https://docs.cypress.io/api/plugins/preprocessors-api.html#Examples

// /* eslint-disable import/no-extraneous-dependencies, global-require */
// const webpack = require('@cypress/webpack-preprocessor')

//Imports
const account = require('./account');
const file = require('./file');
const ipc = require('./ipc');
const terminalReport = require('cypress-terminal-report/src/installLogsPrinter');

module.exports = (on, config) => 
{
  //Coverage
  require('@cypress/code-coverage/task')(on, config);
  on('file:preprocessor', require('@cypress/code-coverage/use-babelrc'));

  //Terminal report
  terminalReport(on, {
    printLogsToConsole: 'always'
  });

  //Tasks
  on('task', {
    ...account,
    ...file,
    ...ipc
  });

  //Config
  return Object.assign({}, config, {
    defaultCommandTimeout: 1000 * 10,
    fixturesFolder: 'tests/e2e/fixtures',
    integrationFolder: 'tests/e2e/specs',
    pluginsFile: 'tests/e2e/plugins/index.js',
    screenshotsFolder: 'tests/e2e/screenshots',
    supportFile: 'tests/e2e/support/index.js',
    videosFolder: 'tests/e2e/videos'
  });
};
