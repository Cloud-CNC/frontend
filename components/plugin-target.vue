<template>
  <!-- Prevent Vue warning about client-server DOM mismatch -->
  <client-only>
    <!-- Actual portal target -->
    <portal-target v-bind="$props">
      <!-- Default content -->
      <slot />
    </portal-target>
  </client-only>
</template>

<script lang="ts">
//Imports
import Vue, {PropOptions} from 'vue';
import {PropWithComponent} from 'portal-vue/types/lib/types';

//Export
export default Vue.extend({
  //See https://github.com/LinusBorg/portal-vue/blob/develop/src/components/mounting-portal.tsx
  props: {
    multiple: {type: Boolean, default: false},
    name: {type: String, required: true},
    slim: {type: Boolean, default: false},
    slotProps: {type: Object, default: () => ({})},
    tag: {type: String, default: 'div'},
    transition: {type: [String, Object, Function]} as PropOptions<
      PropWithComponent
    >,
  }
});
</script>