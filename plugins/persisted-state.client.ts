/**
 * @fileoverview Persisted state plugin
 */

//Imports
import createPersistedState from 'vuex-persistedstate';
import {Plugin} from '@nuxt/types';

//Plugin
const plugin: Plugin = ({store}) =>
{
  //Create the persisted state
  createPersistedState({
    key: 'state',
    paths: [
      'dark'
    ]
  })(store);
};

//Export
export default plugin;