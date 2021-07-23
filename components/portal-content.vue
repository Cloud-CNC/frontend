<template>
  <div>
    <slot v-if="hasContent" />
  </div>
</template>

<script lang="ts">
//Imports
import Vue from 'vue';
import {Transports} from 'portal-vue/types/lib/types';
import {Wormhole} from 'portal-vue';

//Export
export default Vue.extend({
  data: () => ({
    hasContent: false,
    transports: Wormhole.transports
  }),
  props: {
    name: {
      type: String,
      required: true
    },
  },
  watch: {
    //Watch transports for changes
    transports(transports: Transports)
    {
      //Update has content
      this.hasContent = transports[this.name] != null && transports[this.name]!.length > 0;
    }
  }
});
</script>