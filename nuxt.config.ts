/**
 * @fileoverview Nuxt config
 */

//Imports
import {NuxtConfig} from '@nuxt/types';
import colors from 'vuetify/src/util/colors';

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

  //Global CSS
  css: [
  ],

  //Pre-render plugins
  plugins: [
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
    '~/modules/meta.ts'
  ],

  //PWA module configuration
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  //Vuetify module configuration
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.lightBlue.lighten2,
          secondary: colors.deepOrange.lighten2,
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