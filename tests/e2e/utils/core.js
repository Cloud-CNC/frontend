/**
 * @fileoverview Core server helper
 */

//Imports
const childProcess = require('child_process');
const nodeConfig = require('config');
const path = require('path');

//Get the core server location
const coreLocation = path.resolve(nodeConfig.get('core.location'));
console.log(`Starting the core server located at: ${coreLocation}`);

//Start the core server
const coreProcess = childProcess.spawn('node', [
  'app.js'
], {
  cwd: coreLocation,
  env: {
    NODE_ENV: 'development'
  }
});

//Proxy stdout to main thread
coreProcess.stdout.pipe(process.stdout);

//Stop he core server
const exitHandler = () =>
{
  console.log('Stopping the core server');
  coreProcess.kill();
};

process.on('exit', exitHandler);
process.on('SIGINT', exitHandler);