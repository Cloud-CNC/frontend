/**
 * @fileoverview Default development Cloud CNC frontend config
 * This config file uses sain defaults
 */

//Export
module.exports = {
  //Core server options
  core: {
    //Core install location
    location: '../core',

    //URL of the Cloud CNC core (Use an empty string to make the API address relative to the website address)
    url: 'https://127.0.0.1'
  },

  //Mock controller options
  controller: {
    //Controller install location
    location: '../controller'
  },

  //Cryptography options
  cryptography: {
    //TLS certificate	and key location (PEM encoded)
    cert: './config/cert.cer',
    key: './config/key.pem'
  },

  //Persistant data storage
  data: {
    //MongoDB URI	
    database: 'mongodb://localhost:27017/cloud-cnc-development'
  }
};