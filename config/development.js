/**
 * @fileoverview Default development Cloud CNC frontend config
 * This config file uses sain defaults
 */

//Export
module.exports = {
  //Core server options
  core: {
    //URL of the Cloud CNC core (Use an empty string to make the API address relative to the website address)
    url: 'https://127.0.0.1'
  },

  //Development server
  server: {
    //TLS certificate	and key location (Development only) (PEM encoded)
    cert: './config/cert.cer',
    key: './config/key.pem',

    //Enable the development server (Also have to run the serve command)
    enabled: true
  }
};