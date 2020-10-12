<template>
  <v-app data-e2e="app">
    <v-navigation-drawer app temporary color="secondary" v-model="menu">
      <v-list-item nav two-line>
        <v-list-item-content>
          <v-list-item-title class="font-weight-light headline">Cloud CNC</v-list-item-title>
          <v-list-item-subtitle class="font-weight-bold subtitle">V{{ version }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item v-for="route in menuRoutes" :key="route.path">
        <v-list-item-icon>
          <v-icon>{{route.meta.icon}}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-btn text class="font-weight-light" :to="route.path">{{route.name}}</v-btn>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon>
          <v-icon>exit_to_app</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-btn text data-e2e="logout" class="font-weight-light" @click="logout()">Logout</v-btn>
        </v-list-item-content>
      </v-list-item>

      <template v-slot:append>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>open_in_new</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-btn text class="font-weight-light" href="https://cloud-cnc.github.io" target="_blank">Documentation</v-btn>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-navigation-drawer>

    <v-app-bar app color="primary">
      <v-app-bar-nav-icon @click="menu = !menu" data-e2e="menu" v-if="$route.path != '/login'"></v-app-bar-nav-icon>
      <v-toolbar-title class="display-1 font-weight-thin">{{ $route.name }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="invertTheme()" data-e2e="invert">
        <v-icon>invert_colors</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>

    <v-snackbar :timeout="-1" v-model="$store.state.impersonate.visible">
      You're currently impersonating {{$store.state.impersonate.name}}!
      <v-btn color="accent" @click="stopImpersonate(); $store.commit('hideImpersonate')" data-e2e="stop-impersonating">Stop</v-btn>
    </v-snackbar>

    <v-bottom-sheet v-model="$store.state.error.visible">
      <v-sheet class="text-center" color="error" data-e2e="global-error-message" id="error">
        <v-btn icon x-large @click="$store.commit('hideError')" data-e2e="dismiss-global-error-message">
          <v-icon>close</v-icon>
        </v-btn>
        <h1 class="font-weight-light title">{{$store.state.error.name}}</h1>
        <p class="font-weight-light" id="error-description">{{$store.state.error.description}}</p>
      </v-sheet>
    </v-bottom-sheet>
  </v-app>
</template>

<script>
//Imports
import api from './assets/api';
import pkg from '../package.json';

export default {
  computed: {
    menuRoutes: function ()
    {
      return this.$router.options.routes.filter(route => route.meta.menu);
    }
  },
  created: function ()
  {
    //Dark mode
    this.$vuetify.theme.dark = this.$store.state.dark;

    //Version information
    this.version = pkg.version;
  },
  data: () => ({
    impersonate: {
      name: null,
      visible: false
    },
    menu: false,
    version: null
  }),
  methods: {
    invertTheme: function ()
    {
      //Vuex
      this.$store.dispatch('invertTheme');
    },
    logout: function ()
    {
      api.sessions.logout().then(() =>
      {
        this.$router.push('/login');
      });
    },
    stopImpersonate: function ()
    {
      api.accounts.impersonate.stop();
    }
  }
};
</script>

<style>
html {
  overflow-y: auto !important;
}

#error {
  padding: 12px;
}

#error-description {
  margin: 0;
}

.v-btn--active:hover::before,
.v-btn--active::before {
  opacity: 0 !important;
}

html {
  overflow-y: auto;
}
</style>