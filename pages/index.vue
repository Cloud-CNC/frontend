<template>
  <div>
    <h1>Before</h1>
    <plugin-target name="inbetween" multiple>
      <h1>Default</h1>
    </plugin-target>
    <h1>After</h1>
  </div>
</template>

<script lang="ts">
//Imports
import Vue from 'vue';

//Export
export default Vue.extend({
  meta: {
    icon: 'mdi-home',
    name: 'Home',
    index: 10
  }
});
</script>