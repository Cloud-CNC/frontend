/**
 * @fileoverview IPC Helper for E2E Tests
 */

//Imports
const {IPC} = require('node-ipc');

//Export
/**
 * @class IPC helper used to communicate a controller operating in E2E mode
 */
module.exports = class IpcHelper
{
  constructor()
  {
    this.id = '/test-machine';

    //Create the IPC client
    this.client = new IPC();

    this.client.appspace = 'cloud-cnc-e2e-tests';
    this.client.silent = true;

    this.client.connectTo(this.id);
  }

  /**
   * @function Wait for the controller to send the specified message
   * @param {string} msg 
   * @returns {Promise<void>}
   */
  waitForMessage(msg)
  {
    return new Promise(resolve =>
    {
      this.client.of[this.id].on('message', packet =>
      {
        //Convert packet data to string
        const payload = new TextDecoder().decode(Buffer.from(packet.data));

        if (msg == payload)
        {
          resolve();
        }
      });
    });
  }

  /**
   * @function send the payload to the controller
   * @param {string} payload
   * @returns {void}
   */
  send(payload)
  {
    this.client.of[this.id].emit('message', payload);
  }

  /**
   * @function close the IPC socket
   * @returns {void}
   */
  close()
  {
    this.client.disconnect(this.id);
  }
};