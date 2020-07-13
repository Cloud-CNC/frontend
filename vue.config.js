/**
 * @fileoverview Vue CLI config
 */

//Imports
const config = require('config');
const fs = require('fs');
const webpack = require('webpack');

//Export
module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({'process.env.config': JSON.stringify(require('config'))})
    ]
  },
  devServer: {
    cert: fs.readFileSync(config.get('server.cert')),
    key: fs.readFileSync(config.get('server.key'))
  },
  pwa: {
    name: 'Cloud CNC',
    themeColor: '#4CAF50',
    msTileColor: '#121212',
    manifestOptions: {
      background_color: '#121212'
    }
  },
  transpileDependencies: [
    'vuetify'
  ]
};