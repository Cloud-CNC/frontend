/**
 * @fileoverview IPC Test
 */

//Imports
const {IPC} = require('node-ipc');

(async () =>
{
  //Connect to IPC server running on the controller
  const ipc = new IPC();

  ipc.config.appspace = 'cloud-cnc-e2e-tests';
  ipc.config.silent = true;

  await new Promise(resolve => ipc.connectTo('/test-machine', null, resolve));

  ipc.of['/test-machine'].on('connect', () =>
  {
    console.log('Connected!');
  });

  ipc.of['/test-machine'].on('message', packet =>
  {
    //Convert packet data to string
    const data = new TextDecoder().decode(Buffer.from(packet.data));

    console.log(data);
  });

  ipc.of['/test-machine'].on('disconnect', () =>
  {
    console.log('Disconnected!');
  });
})();