/**
 * @fileoverview Vue CLI config
 */

//Imports
const config = require('config');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

//Export
module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({'process.env.config': JSON.stringify(require('config'))})
    ]
  },
  devServer: process.env.NODE_ENV == 'development' ? {
    progress: false,
    cert: fs.readFileSync(path.resolve(config.get('cryptography.cert'))),
    key: fs.readFileSync(path.resolve(config.get('cryptography.key')))
  } : undefined,
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