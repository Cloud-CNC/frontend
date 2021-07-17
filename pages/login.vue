<template>
  <app-center>
    <v-card>
      <v-card-title>Login <v-icon right>mdi-lock</v-icon></v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item>
            <v-list-item-title>Username & Password</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </app-center>
</template>

<script lang="ts">
//Imports
import Vue from 'vue'

//Export
export default Vue.extend({
  meta: {
    hidden: true
  }
});
</script>