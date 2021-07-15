<template>
  <v-app>
    <v-navigation-drawer app color="secondary" temporary v-model="drawer">
      <template v-slot:prepend>
        <v-list-item class="column">
          <img
            alt="Cloud CNC icon"
            class="icon"
            :src="
              require(`~/assets/icon-${
                $vuetify.theme.dark ? 'dark' : 'light'
              }.png`)
            "
          />
          <h4 class="font-weight-light text-h4 title">Cloud CNC</h4>
        </v-list-item>
      </template>

      <v-divider />

      <v-list dense nav>
        <v-list-item
          :key="route.path"
          :to="route.path"
          exact
          router
          v-for="route in routes"
        >
          <v-list-item-action>
            <v-icon>{{ route.meta.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="subtitle-1" v-text="route.meta.name" />
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <v-list-item>
          <v-btn
            class="font-weight-bold subtitle-1 version"
            href="https://github.com/cloud-cnc/frontend"
            plain
          >
            V{{ version }}
          </v-btn>
        </v-list-item>
      </template>
    </v-navigation-drawer>
    <v-app-bar color="primary" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="$route.meta.name" />

      <v-spacer />

      <v-btn @click="invertTheme" icon>
        <v-icon>mdi-invert-colors</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
//Imports
import Vue from 'vue';

//Export
export default Vue.extend({
  computed: {
    /**
     * Sort routes by:
     * 1. Routes with a lower index
     * 2. Routes with a defined index
     * 
     * Routes without an index are treated as having the highest possible integer in EMCAScript
     */
    routes()
    {
      return this.$router.options.routes?.sort((a, b) =>
      {
        //Get route indexes
        const aIndex = a.meta != null && typeof a.meta.index == 'number' ? a.meta.index as number : Number.MAX_SAFE_INTEGER;
        const bIndex = b.meta != null && typeof b.meta.index == 'number' ? b.meta.index as number : Number.MAX_SAFE_INTEGER;

        //Compare
        return aIndex - bIndex;
      });
    },
    version()
    {
      return this.$nuxt.context.env.version;
    }
  },
  beforeCreate()
  {
    //Synchronize the theme
    this.$store.dispatch('synchronizeTheme');
  },
  data: () => ({
    drawer: false
  }),
  methods: {
    invertTheme()
    {
      //Update the state
      this.$store.commit('invertTheme');

      //Synchronize the theme
      this.$store.dispatch('synchronizeTheme');
    }
  }
});
</script>

<style scoped>
.column {
  flex-direction: column;
}

.column:after {
  content: none;
}

.icon {
  margin: 5px;
  width: 40%;
}

.title {
  margin: 5px auto;
}

.version {
  margin: 0 auto;
}
</style>