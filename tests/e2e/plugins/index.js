/* eslint-disable arrow-body-style */
// https://docs.cypress.io/guides/guides/plugins-guide.html

// if you need a custom webpack configuration you can uncomment the following import
// and then use the `file:preprocessor` event
// as explained in the cypress docs
// https://docs.cypress.io/api/plugins/preprocessors-api.html#Examples

// /* eslint-disable import/no-extraneous-dependencies, global-require */
// const webpack = require('@cypress/webpack-preprocessor')

//Set process environment before importing config
process.env.NODE_ENV = 'development';

//Imports
const IpcHelper = require('../utils/ipc');
const childProcess = require('child_process');
const nodeConfig = require('config');
const path = require('path');

//Controller process
let controllerProcess;
let helper;

module.exports = (on, config) => 
{
  // on('file:preprocessor', webpack({
  //  webpackOptions: require('@vue/cli-service/webpack.config'),
  //  watchOptions: {}
  // }))

  require('@cypress/code-coverage/task')(on, config);
  on('file:preprocessor', require('@cypress/code-coverage/use-babelrc'));

  on('task', {
    /**
     * @function Start the controller
     * @param {object} config
     * @param {string} config.controllerID The ID of the controller to pass to the controller
     * @param {string} config.controllerKey The key of the controller to pass to the controller
     * @param {string} config.machineID The ID of the one mock machine to pass to the controller
     * @returns {Promise<void>}
     */
    async startController({controllerID, controllerKey, machineID})
    {
      //Start the controller
      controllerProcess = childProcess.spawn('node', [
        'index.js'
      ], {
        cwd: path.resolve(nodeConfig.get('controller.location')),
        env: {
          NODE_ENV: 'development',
          E2E: 'true',
          CONTROLLER_ID: controllerID,
          CONTROLLER_KEY: controllerKey,
          MACHINE_ID: machineID
        }
      });

      //Proxy stdout to main thread
      controllerProcess.stdout.pipe(process.stdout);

      //Create an IPC helper to talk to the controller
      helper = new IpcHelper();

      await helper.connect();

      //Must return a value
      return null;
    },

    /**
     * @function Add a listener that listens for a specific message from the controller
     * @param {string} msg The message to listen for
     * @returns {string} The listener ID 
     */
    addMessageListener(msg)
    {
      return helper.addMessageListener(msg);
    },

    /**
     * @function Get if the listener has heard the message and remove the listener
     * @param {string} id The listener's ID
     * @returns {boolean}
     */
    hasHeardMessage(id)
    {
      return helper.hasHeardMessage(id);
    },

    /**
     * @function Stop the controller and the IPC helper
     * @returns {null}
     */
    stopController()
    {
      //Stop the IPC helper
      helper.disconnect();

      //Kill the controller
      controllerProcess.kill();

      //Must return a value
      return null;
    }
  });

  return Object.assign({}, config, {
    fixturesFolder: 'tests/e2e/fixtures',
    integrationFolder: 'tests/e2e/specs',
    screenshotsFolder: 'tests/e2e/screenshots',
    videosFolder: 'tests/e2e/videos',
    supportFile: 'tests/e2e/support/index.js'
  });
};
