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
      //In browsers, use the URL.createObjectURL method
      if (typeof URL.createObjectURL == 'function')
      {
        const blob = new Blob([this.data], {
          type: this.mime
        });

        return URL.createObjectURL(blob);
      }
      //In NodeJS, manually create the string
      else
      {
        return `data:text/plain;charset=utf-8,${encodeURIComponent(this.data)}`;
      }
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