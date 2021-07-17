/**
 * @fileoverview Nuxt config
 */

//Imports
import colors from 'vuetify/src/util/colors';
import {NuxtConfig} from '@nuxt/types';
import {version} from './package.json';

//Export
export default {
  //Build target
  target: 'static',

  //Global page headers
  head: {
    titleTemplate: '%s - Cloud CNC',
    title: 'Cloud CNC',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: ''},
      {name: 'format-detection', content: 'telephone=no'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },

  //Environment variables
  env: {
    version
  },

  //Global CSS
  css: [
    '@/assets/global.css'
  ],

  //Pre-render plugins
  plugins: [
    '~/plugins/persisted-state.client.ts'
  ],

  //Auto import components
  components: true,

  //Modules for dev and build
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify'
  ],

  //Modules
  modules: [
    '@nuxtjs/pwa',
    '@/modules/meta.ts',
    '@/modules/plugin/index.ts'
  ],

  //PWA module configuration
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  //Vuetify module configuration
  vuetify: {
    theme: {
      themes: {
        dark: {
          primary: colors.lightBlue.lighten1,
          secondary: colors.blue.lighten1,
          accent: colors.blueGrey.darken3,
          info: colors.lightBlue.accent2,
          warning: colors.amber.base,
          error: colors.red.base,
          success: colors.green.darken1
        },
        light: {
          primary: colors.lightBlue.lighten1,
          secondary: colors.blue.lighten1,
          accent: colors.blueGrey.darken3,
          info: colors.lightBlue.accent2,
          warning: colors.amber.base,
          error: colors.red.base,
          success: colors.green.darken1
        }
      }
    }
  },

  //Build Configuration
  build: {
  }
} as NuxtConfig;