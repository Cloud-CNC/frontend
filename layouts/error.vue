<template>
  <app-center>
    <h1 class="font-weight-light text-h1">Error {{ error.statusCode }}</h1>
    <h4 class="font-weight-light text-h4">{{ error.message }}</h4>
    <v-btn class="home" color="primary" to="/"
      ><v-icon left>mdi-home</v-icon> Take me home</v-btn
    >
  </app-center>
</template>

<script lang="ts">
//Imports
import Vue, {PropType} from 'vue';
import {NuxtError} from '@nuxt/types';

//Export
export default Vue.extend({
  head()
  {
    return {
      title: `Error ${this.error.statusCode}`
    };
  },
  props: {
    error: {
      type: Object as PropType<NuxtError>,
      required: true
    }
  }
});
</script>

<style scoped>
.home {
  margin-top: 10px;
}
</style>