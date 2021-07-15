/**
 * @fileoverview Root Vuex store
 */

//Imports
import {ActionTree, MutationTree} from 'vuex/types/index';

//Get preferred color scheme
const prefersDark = typeof window != 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : true;

//Root state type
type RootState = ReturnType<typeof state>;

//State
export const state = () => ({
  dark: prefersDark
});

//Mutations
export const mutations: MutationTree<RootState> = {
  invertTheme: state =>
  {
    state.dark = !state.dark;
  }
};

//Actions
export const actions: ActionTree<RootState, RootState> = {
  //Update vuetify
  synchronizeTheme(ctx)
  {
    this.app.vuetify!.framework.theme.dark = ctx.state.dark;
  }
};