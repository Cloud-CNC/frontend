<template>
  <v-btn class="download" :download="filename" :href="href" ref="link">
    <slot />
  </v-btn>
</template>

<script>
export default {
  computed: {
    href: function ()    
    {
      const blob = new Blob([this.data], {
        type: this.mime
      });

      return URL.createObjectURL(blob);
    }
  },
  props: {
    data: String,
    mime: {
      default: 'text/plain',
      type: String
    },
    filename: String
  }
};
</script>