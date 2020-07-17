/**
 * @fileoverview IPC helper for E2E tests
 */

//Imports
const uuid = require('uuid').v4;
const {IPC} = require('node-ipc');

//Export
/**
 * @class IPC helper used to communicate a controller operating in E2E mode
 */
module.exports = class IpcHelper
{
  constructor()
  {
    this.id = 'test-machine';
    this.listeners = {};

    //Create the IPC client
    this.client = new IPC();

    this.client.config.appspace = 'cloud-cnc-e2e-tests';
    this.client.config.silent = true;
  }

  /**
   * @function Connect to the controller
   * @returns {Promise<void>}
   */
  async connect()
  {
    await new Promise(resolve => this.client.connectTo(this.id, null, resolve));

    //Update listeners when a message is sent
    this.client.of[this.id].on('message', packet =>
    {
      const payload = new TextDecoder().decode(Buffer.from(packet.data));

      console.log(`Received "${payload}" from controller!`);

      Object.keys(this.listeners).forEach(listener =>
      {
        //If the message matches a listener, raise the heard boolean
        if (this.listeners[listener].msg == payload)
        {
          this.listeners[listener].heard = true;
        }
      });

      //Echo back to controller to forward to the core to forward to the client
      this.client.of[this.id].emit('message', `Machine received "${payload}"!`);
    });
  }

  /**
   * @function Add a listener that listens for a specific message from the controller
   * @param {string} msg The message to listen for
   * @returns {string} The listener ID 
   */
  addMessageListener(msg)
  {
    //Generate a new listener ID
    const id = uuid();

    //Add to listeners
    this.listeners[id] = {
      heard: false,
      msg
    };

    return id;
  }

  /**
   * @function Get if the listener has heard the message and remove the listener
   * **WARNING**: This function will destroy the listener if it returns true
   * @param {string} id The listener's ID
   * @returns {boolean}
   */
  hasHeardMessage(id)
  {
    //Get if the listener has heard the message
    const heard = this.listeners[id].heard;

    //Delete the listener if heard
    if (heard)
    {
      delete this.listeners[id];
    }

    return heard;
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
   * @function Disconnect from the controller
   * @returns {void}
   */
  disconnect()
  {
    this.client.disconnect(this.id);
  }
};