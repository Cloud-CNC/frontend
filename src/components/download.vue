<template>
  <v-btn
    class="download"
    :download="filename"
    :href="`data:text/plain;charset=utf-8,${encodeURIComponent(this.data)}`"
    ref="link"
  >
    <slot />
  </v-btn>
</template>

<script>
export default {
  props: {
    data: String,
    filename: String
  }
};
</script>