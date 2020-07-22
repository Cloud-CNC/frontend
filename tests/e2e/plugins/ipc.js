/**
 * @fileoverview IPC Plugin
 */

//Imports
const IpcHelper = require('../utils/ipc');
const childProcess = require('child_process');
const nodeConfig = require('config');
const path = require('path');

//Controller process
let controllerProcess;
let helper;

//Exports
module.exports = {
  /**
   * @function Start the controller
   * @param {object} config
   * @param {string} config.controllerID The ID of the controller to pass to the controller
   * @param {string} config.controllerKey The key of the controller to pass to the controller
   * @param {string} config.machineID The ID of the one mock machine to pass to the controller
   * @returns {Promise<void>}
   */
  start: async ({controllerID, controllerKey, machineID}) =>
  {
    //Get the controller location
    const controllerLocation = path.resolve(nodeConfig.get('controller.location'));
    console.log(`Starting the mock controller located at: ${controllerLocation}`);

    //Start the controller
    controllerProcess = childProcess.spawn('node', [
      'index.js'
    ], {
      cwd: controllerLocation,
      env: {
        CONTROLLER_ID: controllerID,
        CONTROLLER_KEY: controllerKey,
        E2E: 'true',
        LOG: 'console',
        MACHINE_ID: machineID,
        NODE_ENV: 'development',
        PATH: process.env.PATH
      }
    });

    //Proxy std streams to main thread
    controllerProcess.stderr.pipe(process.stderr);
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
  addMessageListener: msg =>
  {
    return helper.addMessageListener(msg);
  },

  /**
   * @function Get if the listener has heard the message and remove the listener
   * @param {string} id The listener's ID
   * @returns {boolean}
   */
  hasHeardMessage: id =>
  {
    return helper.hasHeardMessage(id);
  },

  /**
   * @function Stop the controller and the IPC helper
   * @returns {null}
   */
  stop: () =>
  {
    //Stop the IPC helper
    helper.disconnect();

    //Kill the controller
    controllerProcess.kill();

    //Must return a value
    return null;
  }
};