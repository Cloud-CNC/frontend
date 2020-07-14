/**
 * @fileoverview Vue CLI config
 */

//Imports
const config = require('config');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const p1 = path.resolve('./config');
console.log(`P1: ${p1}`);
const p2 = fs.readdirSync(p1);
console.log(`P2: ${p2.join(', ')}`);

//Export
module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({'process.env.config': JSON.stringify(require('config'))})
    ]
  },
  devServer: process.env.NODE_ENV == 'development' ? {
    cert: fs.readFileSync(path.resolve(config.get('server.cert'))),
    key: fs.readFileSync(path.resolve(config.get('server.key')))
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