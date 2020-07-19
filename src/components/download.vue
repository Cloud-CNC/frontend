<template>
  <v-btn class="download" @click="download">
    <a :download="filename" ref="link" />
    <slot />
  </v-btn>
</template>

<script>
export default {
  data: () => ({
    href: ''
  }),
  methods: {
    async download(event)
    {
      //Get link
      const link = this.$refs.link;

      //Prevent recursively ddosing the user
      if (event.target != link)
      {
        //Resolve data
        const data = typeof this.data == 'string' ? this.data : await this.data();

        //Generate URL
        let url;

        //In browsers, use the URL.createObjectURL method
        if (typeof URL.createObjectURL == 'function')
        {
          const blob = new Blob([data], {
            type: this.mime
          });

          url = URL.createObjectURL(blob);
        }
        //In NodeJS, manually create the string
        else
        {
          url = `data:${this.mime};charset=utf-8,${encodeURIComponent(data)}`;
        }

        //Download
        link.href = url;

        if (!window.disableDownloads)
        {
          link.click();
        }
      }
    }
  },
  props: {
    data: [String, Function],
    filename: String,
    mime: {
      default: 'text/plain',
      type: String
    }
  }
};
</script>