/**
 * @fileoverview Vuex store
 */

//Imports
import PersistedState from 'vuex-persistedstate';
import Vue from 'vue';
import Vuetify from '@/plugins/vuetify';
import Vuex from 'vuex';

//Vue plugin
Vue.use(Vuex);

//Export
export default new Vuex.Store({
  plugins: [PersistedState()],
  state: {
    dark: true,
    error: {
      name: null,
      description: null,
      visible: false
    },
    impersonate: {
      name: null,
      visible: false
    }
  },
  mutations: {
    hideError: state =>
    {
      state.error.name = null;
      state.error.description = null;
      state.error.visible = false;
    },
    showError: (state, name, description) =>
    {
      state.error.name = name;
      state.error.description = description;
      state.error.visible = true;
    },
    hideImpersonate: state =>
    {
      state.impersonate.name = null;
      state.impersonate.visible = false;
    },
    showImpersonate: (state, name) =>
    {
      state.impersonate.name = name;
      state.impersonate.visible = true;
    }
  },
  actions: {
    invertTheme: state =>
    {
      console.log('Inverting!');
      state.dark = !state.dark;
      Vuetify.theme.dark = state.dark;
    }
  },
  modules: {
  }
});
