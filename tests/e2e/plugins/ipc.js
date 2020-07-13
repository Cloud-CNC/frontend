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