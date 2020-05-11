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
  plugins: [PersistedState({
    paths: [
      'dark',
      'impersonate.name',
      'impersonate.visible'
    ]
  })],
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
    invertTheme: state =>
    {
      state.dark = !state.dark;
    },
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
    invertTheme: ctx =>
    {
      ctx.commit('invertTheme');
      Vuetify.framework.theme.dark = ctx.state.dark;
    }
  },
  modules: {
  }
});
